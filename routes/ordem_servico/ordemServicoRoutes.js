const express = require('express');
const { 
    listaAtivoPorCliente, 
    listarItens, 
    criarOs, 
    criarItensAoCriarOS, 
    loadItemOs,
    loadDados,
} = require('../../controllers/ordem_servico/ordemServicoController');

const router = express.Router();

router.get('/ordem-servico/ativos/:codigo_cliente', listaAtivoPorCliente);
router.get('/ordem-servico/listar-item', listarItens);
router.get('/ordem-servico-editar-load-dados/:codigo_os', loadDados);
router.get('/ordem-servico-editar-load-item/:codigo_os', loadItemOs);
router.post('/ordem-servico/criar_os', criarOs);
router.post('/ordem-servico/criar_os/inserir_item', criarItensAoCriarOS);

module.exports = router;
