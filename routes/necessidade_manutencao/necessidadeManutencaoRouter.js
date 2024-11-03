const express = require('express');
const { 
    novaNM,
    uploadFoto,
    atualizarNM,
    deletarNM,
    carregarDadosNM,
    carregarDadosNMativos,
    upsertAtivoNm,
    deletarNMativo,
    upsertAtivoNmItem,
    carregarDadosItemAtivoNm,
    deletarNMativoItem
} = require('../../controllers/necessidade_manutencao/necessidadeManutencaoController');

const router = express.Router();

const upload = require('../../middlewares/midMulterManutencao'); 

router.post('/necessidade_manutencao/criar', novaNM);
router.put('/necessidade_manutencao/atualizar', atualizarNM);
router.delete('/necessidade_manutencao/deletar', deletarNM);
router.post('/necessidade_manutencao/upload/foto', upload.single('file'), uploadFoto);
router.get('/necessidade_manutencao/carregarDados', carregarDadosNM);

router.post('/necessidade_manutencao/ativo-upsert', upsertAtivoNm);
router.get('/necessidade_manutencao/carregarDadosAtivos', carregarDadosNMativos);
router.delete('/necessidade_manutencao/deletarAtivo', deletarNMativo);

router.post('/necessidade_manutencao/ativo-upsert-item', upsertAtivoNmItem);
router.get('/necessidade_manutencao/ativo-load-item', carregarDadosItemAtivoNm);
router.delete('/necessidade_manutencao/deletar-item-ativo', deletarNMativoItem);


module.exports = router;
