const express = require('express');
const { 
    listaAtivoPorCliente, listarItens, 
} = require('../../controllers/ordem_servico/ordemServicoController');

const router = express.Router();

router.get('/ordem-servico/ativos/:codigo_cliente', listaAtivoPorCliente);
router.get('/ordem-servico/listar-item', listarItens);

module.exports = router;
