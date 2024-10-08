const express = require('express');
const { 
    listaAtivoPorCliente, 
    listarItens, 
    criarOs, 
    criarItensAoCriarOS, 
    loadItemOs,
    loadDados,
    editarDadosOS,
    deletarItemOS,
    upsertItemOS,
    deletarOS,
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

//TODO - UPDATE ITENS DA OS
router.put('/ordem-servico/upsert_item', upsertItemOS); //Lógica de Update e Insert no mesmo endpoint 
                                                                                                    

//DELETES
//TODO - DELETE DE ITENS DA OS
router.delete('/ordem-servico/editar_os/deletar_item', deletarItemOS); 
router.delete('/ordem-servico/editar_os/deletar_os', deletarOS); 


module.exports = router;
