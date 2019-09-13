import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // transforma uma função de callback em async/await

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // [, token] => descarta a primeira posição e usa apenas a segunda
  const [, token] = authHeader.split(' '); // Dive o token a partir do espaço (depois do Bearer)

  // Verifica se o token é valido
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // se passar, token valido

    // MAAS, se o cara trocar a senha, o token anterior ainda é válido.. então ele ainda consegue se manter logado... corrigir isso!

    // Cria uma variável com o id do usuário, para que as próximas funções das rotas já saibam quem é o usuário logado
    req.userId = decoded.id;

    return next();
  } catch (error) {
    // token inválido
    return res.status(401).json({ error: 'Token invalid' });
  }
};
