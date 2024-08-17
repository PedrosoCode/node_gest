const express = require('express');
const { cadastrarParceiroNegocio, atualizarParceiroNegocio, listarParceirosNegocio, listarParceiroNegocioPorID, deletarParceiroNegocio } = require('../../../controllers/cadastro_basico/parceiro_negocio/cadBasParceiroNegocioController');
const authMiddleware = require('../../../middlewares/midAutenticar');

const router = express.Router();

router.post('/parceiros', cadastrarParceiroNegocio);
router.put('/parceiros/:id', atualizarParceiroNegocio);
router.get('/parceiros', listarParceirosNegocio);
router.get('/parceiros/:id', listarParceiroNegocioPorID);
router.delete('/parceiros/:id', deletarParceiroNegocio);

module.exports = router;
