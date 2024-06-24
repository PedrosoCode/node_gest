const express = require('express');
const { cadastrarAmbiente } = require('../../../controllers/cadastro_basico/ambiente/ambienteController');

const router = express.Router();

router.post('/ambientes', cadastrarAmbiente);

module.exports = router;
