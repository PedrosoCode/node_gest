// authRoutes.js
const express = require('express');
const { cadastrarUsuario, loginUsuario, obterUsuario, verificarToken, listarEmpresas } = require('../../controllers/auth/authController');
const midAutenticar = require('../../middlewares/midAutenticar'); 
const router = express.Router();

router.post('/signup', cadastrarUsuario);
router.post('/login', loginUsuario);
router.get('/me', midAutenticar, obterUsuario);
router.get('/verificarToken', midAutenticar, verificarToken);
router.get('/empresas', listarEmpresas);

module.exports = router;
