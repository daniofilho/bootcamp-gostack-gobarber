import * as Yup from 'yup'; // Yup não exporta nada por default - usado para validação de entrada

import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    // Define o formato dos dados
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // # Verifica se os dados passados estão no formato correto
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // # Verifica se usuário existe antes de cadastrar
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // # cria e retorna apenas os campos necessários
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // Só executa uma validação quando(when) o campo for informado
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when(
        'password',
        (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field // garantindo que o confirmPassword seja igual ao Password
      ),
    });

    // # Verifica se os dados passados estão no formato correto
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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
