import { isBefore, subHours } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';

import CancellationMail from '../jobs/CancellationMail';

import Queue from '../../lib/Queue';
import Cache from '../../lib/Cache';

class CancelAppointmentService {
  async run({ appointment_id, user_id }) {
    const appointment = await Appointment.findByPk(appointment_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // verifica se é dono do agendamento
    if (appointment.user_id !== user_id) {
      throw new Error(`Your don't have permission to cancel this appointment`);
    }

    // verifica se está fazendo isso 2 horas antess
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      throw new Error(`You can only cancel appointments 2 hours in advance`);
    }

    // cancela e salva
    appointment.canceled_at = new Date();

    await appointment.save();

    // envia um e-mail - o insere na fila
    Queue.add(CancellationMail.key, {
      appointment,
    });

    // Invalidate cache
    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CancelAppointmentService();
