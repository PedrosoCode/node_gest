const express = require('express');
const { cadastrarAmbiente, atualizarAmbiente, listarAmbientes, listarAmbientesPorID } = require('../../../controllers/cadastro_basico/ambiente/ambienteController');

const router = express.Router();

router.post('/ambientes', cadastrarAmbiente);
router.put('/ambientes/:id', atualizarAmbiente);
router.get('/ambientes', listarAmbientes);
router.get('/ambientes/:id', listarAmbientesPorID); 

module.exports = router;
