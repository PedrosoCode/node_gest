const express = require('express');
const { 
    listaAtivoPorCliente, 
} = require('../../controllers/ordem_servico/ordemServicoController');

const router = express.Router();

router.get('/ordem-servico/ativos/:codigo_cliente', listaAtivoPorCliente);

module.exports = router;
