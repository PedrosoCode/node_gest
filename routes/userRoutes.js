const express = require('express');
const { listarUsuarios, cadastrarUsuario, atualizarUsuario } = require('../controllers/userController');

const router = express.Router();

router.get('/usuarios', listarUsuarios);
router.post('/usuarios', cadastrarUsuario);
router.put('/usuarios/:id', atualizarUsuario);

module.exports = router;
