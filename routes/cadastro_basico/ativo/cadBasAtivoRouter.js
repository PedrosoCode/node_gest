const express = require('express');
const {
  cadastrarAtivo,
  atualizarAtivo,
  listarAtivos,
  listarAtivoPorID,
  deletarAtivo,
  listarTecnicos,
  buscarPrioridade,
  uploadFotos,   
  deletarFoto,    
  listarFotosAtivo 
} = require('../../../controllers/cadastro_basico/ativo/cadBasAtivoController');

const upload = require('../../../config/uploadConfig'); 

const router = express.Router();

router.post('/ativos', cadastrarAtivo);
router.put('/ativos/:id', atualizarAtivo);
router.get('/ativos', listarAtivos);
router.get('/ativos/:id', listarAtivoPorID);
router.delete('/ativos/:id', deletarAtivo);
router.get('/tecnicos', listarTecnicos);
router.get('/ativos-prioridade', buscarPrioridade);
router.post('/ativos/:id/fotos', upload.array('fotos', 10), uploadFotos);
router.delete('/ativos/:id/fotos/:fotoId', deletarFoto);
router.get('/ativos/:id/fotos', listarFotosAtivo);

module.exports = router;
