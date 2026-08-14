const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT
 */
function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = {
  verificarToken
};
