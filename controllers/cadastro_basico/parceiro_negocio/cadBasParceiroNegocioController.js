const pool = require('../../../config/db');

const cadastrarParceiroNegocio = async (req, res) => {
  try {
    const { nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro, codigo_empresa } = req.body;
    await pool.query('INSERT INTO tb_cad_parceiro_negocio (nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro, codigo_empresa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', 
    [nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro, codigo_empresa]);
    res.status(201).send('Parceiro de negócio cadastrado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const atualizarParceiroNegocio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro, codigo_empresa } = req.body;

    const parceiroExistente = await pool.query('SELECT * FROM tb_cad_parceiro_negocio WHERE codigo = $1', [id]);
    if (parceiroExistente.rows.length === 0) {
      return res.status(404).json('Parceiro de negócio não encontrado');
    }

    await pool.query('UPDATE tb_cad_parceiro_negocio SET nome_razao_social = $1, is_cnpj = $2, documento = $3, endereco = $4, cidade = $5, estado = $6, cep = $7, telefone = $8, email = $9, tipo_parceiro = $10, codigo_empresa = $11 WHERE codigo = $12', 
    [nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro, codigo_empresa, id]);

    res.status(200).send('Parceiro de negócio atualizado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const listarParceirosNegocio = async (req, res) => {
  try {
    const parceiros = await pool.query('SELECT * FROM tb_cad_parceiro_negocio');
    res.json(parceiros.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const listarParceiroNegocioPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const parceiro = await pool.query('SELECT * FROM tb_cad_parceiro_negocio WHERE codigo = $1', [id]);
    if (parceiro.rows.length === 0) {
      return res.status(404).json('Parceiro de negócio não encontrado');
    }
    res.json(parceiro.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deletarParceiroNegocio = async (req, res) => {
  try {
    const { id } = req.params;

    const parceiroExistente = await pool.query('SELECT * FROM tb_cad_parceiro_negocio WHERE codigo = $1', [id]);
    if (parceiroExistente.rows.length === 0) {
      return res.status(404).json('Parceiro de negócio não encontrado');
    }

    await pool.query('DELETE FROM tb_cad_parceiro_negocio WHERE codigo = $1', [id]);
    res.status(200).send('Parceiro de negócio deletado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  cadastrarParceiroNegocio,
  atualizarParceiroNegocio,
  listarParceirosNegocio,
  listarParceiroNegocioPorID,
  deletarParceiroNegocio,
};
