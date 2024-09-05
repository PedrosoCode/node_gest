const express = require('express');
const { 
    cadastrarItemEstoque, 
} = require('../../../controllers/cadastro_basico/item/cadBasItemController');

const router = express.Router();

router.post('/item', cadastrarItemEstoque);

module.exports = router;
