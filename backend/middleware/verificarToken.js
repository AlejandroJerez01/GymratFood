const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No hay token, acceso denegado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, nombre, email }
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};