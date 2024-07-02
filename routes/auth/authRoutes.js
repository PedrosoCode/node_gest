const express = require('express');
const { cadastrarUsuario, loginUsuario } = require('../../controllers/auth/authController');
const router = express.Router();

router.post('/signup', cadastrarUsuario);
router.post('/login', loginUsuario);

module.exports = router;
