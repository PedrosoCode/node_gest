const express = require('express');
const { 
    novaNM,
    uploadFoto,
} = require('../../controllers/necessidade_manutencao/necessidadeManutencaoController');

const router = express.Router();

const upload = require('../../middlewares/midMulterManutencao'); 

router.post('/necessidade_manutencao/criar', novaNM);
router.post('/ativos/:codigo_nm/foto', upload.single('file'), uploadFoto);

module.exports = router;
