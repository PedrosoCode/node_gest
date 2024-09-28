const express = require('express');
const { 
    listaAtivoPorCliente, 
    listarItens, 
    criarOs, 
    criarItensAoCriarOS, 
    loadItemOs,
    loadDados,
    editarDadosOS,
    editarItemOS,
} = require('../../controllers/ordem_servico/ordemServicoController');

const router = express.Router();

//GETS
router.get('/ordem-servico/ativos/:codigo_cliente', listaAtivoPorCliente);
router.get('/ordem-servico/listar-item', listarItens);
router.get('/ordem-servico-editar-load-dados/:codigo_os', loadDados);
router.get('/ordem-servico-editar-load-item/:codigo_os', loadItemOs);

//POSTS
router.post('/ordem-servico/criar_os', criarOs);
router.post('/ordem-servico/criar_os/inserir_item', criarItensAoCriarOS);

//PUTS
router.put('/ordem-servico/editar_os/editar_dados', editarDadosOS);
router.put('/ordem-servico/editar_os/editar_item', editarItemOS);
//TODO - UPDATE ITENS DA OS

//DELETES
//TODO - DELETE DE ITENS DA OS


module.exports = router;
