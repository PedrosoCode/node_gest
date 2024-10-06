const express = require('express');
const { 
    novaNM,
} = require('../../controllers/necessidade_manutencao/necessidadeManutencaoController');

const router = express.Router();

router.post('/necessidade_manutencao/criar', novaNM);

module.exports = router;
