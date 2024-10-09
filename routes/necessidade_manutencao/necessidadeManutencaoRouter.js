const express = require('express');
const { 
    novaNM,
    uploadFoto,
    atualizarNM,
} = require('../../controllers/necessidade_manutencao/necessidadeManutencaoController');

const router = express.Router();

const upload = require('../../middlewares/midMulterManutencao'); 

router.post('/necessidade_manutencao/criar', novaNM);
router.put('/necessidade_manutencao/atualizar', atualizarNM);
router.post('/ativos/:codigo_nm/foto', upload.single('file'), uploadFoto);

module.exports = router;
