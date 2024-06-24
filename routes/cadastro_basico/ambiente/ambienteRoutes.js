const express = require('express');
const { cadastrarAmbiente, atualizarAmbiente } = require('../controllers/ambienteController');

const router = express.Router();

router.post('/ambientes', cadastrarAmbiente);
router.put('/ambientes/:id', atualizarAmbiente);

module.exports = router;
