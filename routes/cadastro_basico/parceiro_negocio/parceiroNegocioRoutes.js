// routes/cadastro_basico/parceiro_negocio/parceiroNegocioRoutes.js
const express = require('express');
const router = express.Router();
const cadBasParceiroNegocioController = require('../../../controllers/cadastro_basico/parceiro_negocio/cadBasParceiroNegocioController');

router.post('/parceiros', cadBasParceiroNegocioController.cadastrarParceiroNegocio);
router.put('/parceiros/:id', cadBasParceiroNegocioController.atualizarParceiroNegocio);
router.get('/parceiros', cadBasParceiroNegocioController.listarParceirosNegocio);
router.get('/parceiros/:id', cadBasParceiroNegocioController.listarParceiroNegocioPorID);
router.delete('/parceiros/:id', cadBasParceiroNegocioController.deletarParceiroNegocio);

module.exports = router;
