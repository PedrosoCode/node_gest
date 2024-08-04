const express = require('express');
const { cadastrarAtivo, atualizarAtivo, listarAtivos, listarAtivoPorID, deletarAtivo, listarTecnicos, buscarPrioridade } = require('../../../controllers/cadastro_basico/ativo/cadBasAtivoController');

const router = express.Router();

router.post('/ativos', cadastrarAtivo);
router.put('/ativos/:id', atualizarAtivo);
router.get('/ativos', listarAtivos);
router.get('/ativos/:id', listarAtivoPorID);
router.delete('/ativos/:id', deletarAtivo);
router.get('/tecnicos', listarTecnicos); 
router.get('/ativos-prioridade', buscarPrioridade); 

module.exports = router;
