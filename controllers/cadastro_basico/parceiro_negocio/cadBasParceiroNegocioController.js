// controllers/parceiroNegocioController.js
const ParceiroNegocio = require('../../../models/ModParceiroNegocio');
const decodeJWT = require('../../../utils/jwtDecode');

const cadastrarParceiroNegocio = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {
      nome_razao_social,
      is_cnpj,
      documento,
      endereco,
      cidade,
      estado,
      cep,
      telefone,
      email,
      tipo_parceiro,
    } = req.body;
    const codigo_empresa = decoded.codigo_empresa;

    const novoParceiro = await ParceiroNegocio.create({
      nome_razao_social,
      is_cnpj,
      documento,
      endereco,
      cidade,
      estado,
      cep,
      telefone,
      email,
      tipo_parceiro,
      codigo_empresa,
    });

    res.status(201).json(novoParceiro);
  } catch (err) {
    console.error('Erro ao cadastrar parceiro de negócio:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const atualizarParceiroNegocio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome_razao_social,
      is_cnpj,
      documento,
      endereco,
      cidade,
      estado,
      cep,
      telefone,
      email,
      tipo_parceiro,
      codigo_empresa,
    } = req.body;

    const parceiro = await ParceiroNegocio.findByPk(id);
    if (!parceiro) {
      return res.status(404).json('Parceiro de negócio não encontrado');
    }

    await parceiro.update({
      nome_razao_social,
      is_cnpj,
      documento,
      endereco,
      cidade,
      estado,
      cep,
      telefone,
      email,
      tipo_parceiro,
      codigo_empresa,
    });

    res.status(200).json(parceiro);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarParceirosNegocio = async (req, res) => {
  try {
    const parceiros = await ParceiroNegocio.findAll();
    res.json(parceiros);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarParceiroNegocioPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const parceiro = await ParceiroNegocio.findByPk(id);
    if (!parceiro) {
      return res.status(404).json('Parceiro de negócio não encontrado');
    }
    res.json(parceiro);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const deletarParceiroNegocio = async (req, res) => {
  try {
    const { id } = req.params;

    const parceiro = await ParceiroNegocio.findByPk(id);
    if (!parceiro) {
      return res.status(404).json('Parceiro de negócio não encontrado');
    }

    await parceiro.destroy();
    res.status(200).send('Parceiro de negócio deletado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  cadastrarParceiroNegocio,
  atualizarParceiroNegocio,
  listarParceirosNegocio,
  listarParceiroNegocioPorID,
  deletarParceiroNegocio,
};
