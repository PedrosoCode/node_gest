// middleware/autenticar.js
const jwt = require('jsonwebtoken');

const midAutenticar = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Acesso Negado');
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado;
    next();
  } catch (error) {
    res.status(400).send('Token Inválido');
  }
};

module.exports = midAutenticar;
