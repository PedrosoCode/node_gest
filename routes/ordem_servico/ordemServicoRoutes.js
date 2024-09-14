const express = require('express');
const { 
    listaAtivoPorCliente, listarItens, criarOs, criarItensAoCriarOS,
} = require('../../controllers/ordem_servico/ordemServicoController');

const router = express.Router();

router.get('/ordem-servico/ativos/:codigo_cliente', listaAtivoPorCliente);
router.get('/ordem-servico/listar-item', listarItens);
router.post('/ordem-servico/criar_os', criarOs);
router.post('/ordem-servico/criar_os/inserir_item', criarItensAoCriarOS);

module.exports = router;
