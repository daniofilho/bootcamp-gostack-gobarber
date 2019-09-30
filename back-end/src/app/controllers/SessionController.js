import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

import User from '../models/User';
import File from '../models/File';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    // verifica se usuário passado existe
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // verifica a senha
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, avatar, provider } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign(
        // Gera o token
        {
          // inclue mais informações no token
          id,
        },
        // string único
        authConfig.secret,
        {
          // configurações do token
          expiresIn: authConfig.expiresIn,
        }
      ),
    });
  }
}

export default new SessionController();
