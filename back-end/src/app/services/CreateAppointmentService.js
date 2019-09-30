import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import Appointment from '../models/Appointment';

import Notification from '../schemas/notification';

import Cache from '../../lib/Cache';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    // # Verifica se o id informado é de um provider mesmo
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      throw new Error('You can only create appointments with providers');
    }

    // # verifica se usuário marcando agendamento não é ele mesmo
    if (provider_id === user_id) {
      throw new Error("You can't create an appointment to yourseld");
    }

    // # verifica se data de agendamento é uma data futura
    const hourStart = startOfHour(parseISO(date)); // sempre pega o início da hora, ex: 19h30 => 19h00

    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permitted');
    }

    // # verifica se data já está "ocupada"
    const checkDateAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkDateAvailability) {
      throw new Error('Appointment date is not available');
    }

    // # cria o agendamento

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
    });

    // # Notifica o prestador de serviço
    const user = await User.findByPk(user_id);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    // Invalidate cache
    await Cache.invalidatePrefix(`user:${user.id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
