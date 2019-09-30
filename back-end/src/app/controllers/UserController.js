import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

class UserController {
  async store(req, res) {
    // # Verifica se usuário existe antes de cadastrar
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // # cria e retorna apenas os campos necessários
    const { id, name, email, provider } = await User.create(req.body);

    // limpa o cache de providers
    if (provider) {
      await Cache.invalidate('providers');
    }

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId); // find by Primary Key

    // Verifica se está cadastrando um novo e-mail
    if (email !== user.email) {
      // Se sim, verifica se já existe
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }
    }

    // Verifica se a oldPassword está certa Se ele informou a senha antiga
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // tudo certo, então atualiza o user
    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}
export default new UserController();
