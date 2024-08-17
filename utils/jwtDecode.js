const jwt = require('jsonwebtoken');

const decodeJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error.message);
    return null;
  }
};

module.exports = decodeJWT;
