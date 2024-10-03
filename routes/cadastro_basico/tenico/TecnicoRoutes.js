const express = require('express');
const { 
    cadastrarTecnico, 
    deletarTecnico,
    listarTecnico,
} = require('../../../controllers/cadastro_basico/tecnico/cadastroTecnicoController.');

const router = express.Router();

router.post('/tecnico/cadastrar', cadastrarTecnico);
router.delete('/tecnico/deletar', deletarTecnico);
router.get('/tecnico/listar', listarTecnico);

module.exports = router;
