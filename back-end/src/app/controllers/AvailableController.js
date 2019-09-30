import AvailableService from '../services/AvailableService';

// controller para exibir apenas horários disponíveis
class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // converte a data que veio
    const searchDate = Number(date);

    const available = await AvailableService.run({
      provider_id: req.params.providerId,
      searchDate,
    });

    return res.json(available);
  }
}
export default new AvailableController();
