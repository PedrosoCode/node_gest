const express = require('express');
const { cadastrarAtivo, atualizarAtivo, listarAtivos, listarAtivoPorID } = require('../../../controllers/cadastro_basico/ativo/cadBasAtivoController');

const router = express.Router();

router.post('/ativos', cadastrarAtivo);
router.put('/ativos/:id', atualizarAtivo);
router.get('/ativos', listarAtivos);
router.get('/ativos/:id', listarAtivoPorID);

module.exports = router;
