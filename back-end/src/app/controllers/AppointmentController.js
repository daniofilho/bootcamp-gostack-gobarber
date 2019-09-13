import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const resultsPerPage = 20;

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: resultsPerPage,
      offset: (page - 1) * resultsPerPage,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointment);
  }

  async store(req, res) {
    // # valida campos
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // # Verifica se o id informado é de um provider mesmo
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // # verifica se usuário marcando agendamento não é ele mesmo
    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: "You can't create an appointment to yourseld" });
    }

    // # verifica se data de agendamento é uma data futura
    const hourStart = startOfHour(parseISO(date)); // sempre pega o início da hora, ex: 19h30 => 19h00

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
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
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    // # cria o agendamento

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    // # Notifica o prestador de serviço
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
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
    if (appointment.user_id !== req.userId) {
      return res.status(404).json({
        error: "Your don't have permission to cancel this appointment",
      });
    }

    // verifica se está fazendo isso 2 horas antess
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(404).json({
        error: 'You can only cancel appointments 2 hours in advance',
      });
    }

    // cancela e salva
    appointment.canceled_at = new Date();

    await appointment.save();

    // envia um e-mail - o insere na fila
    Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
