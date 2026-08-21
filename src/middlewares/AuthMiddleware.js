const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../services/AuthService');

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não enviado.' });
  }

  const token = cabecalho.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuarioId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = { autenticar };