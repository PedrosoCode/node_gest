const pool = require('../../../config/db');

const cadastrarAtivo = async (req, res) => {
  try {
    const { codigo_cliente, numero_serie, codigo_fabricante, modelo, codigo_prioridade, codigo_tecnico_responsavel, observacao, nivel_manutencao, codigo_empresa } = req.body;
    await pool.query('CALL sp_cadastro_basico_ativo($1, $2, $3, $4, $5, $6, $7, $8, $9)', [codigo_cliente, numero_serie, codigo_fabricante, modelo, codigo_prioridade, codigo_tecnico_responsavel, observacao, nivel_manutencao, codigo_empresa]);
    res.status(201).send('Ativo cadastrado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const atualizarAtivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo_cliente, numero_serie, codigo_fabricante, modelo, codigo_prioridade, codigo_tecnico_responsavel, observacao, nivel_manutencao, codigo_empresa } = req.body;

    const ativoExistente = await pool.query('SELECT * FROM tb_cad_ativo_main WHERE codigo = $1', [id]);
    if (ativoExistente.rows.length === 0) {
      return res.status(404).json('Ativo não encontrado');
    }

    await pool.query('CALL sp_update_cadastro_basico_ativo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id, codigo_cliente, numero_serie, codigo_fabricante, modelo, codigo_prioridade, codigo_tecnico_responsavel, observacao, nivel_manutencao, codigo_empresa]);

    const ativoAtualizado = await pool.query('SELECT * FROM tb_cad_ativo_main WHERE codigo = $1', [id]);
    res.json(ativoAtualizado.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const listarAtivos = async (req, res) => {
  try {
    const ativos = await pool.query('SELECT * FROM tb_cad_ativo_main');
    res.json(ativos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const listarAtivoPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const ativo = await pool.query('SELECT * FROM tb_cad_ativo_main WHERE codigo = $1', [id]);
    if (ativo.rows.length === 0) {
      return res.status(404).json('Ativo não encontrado');
    }
    res.json(ativo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  cadastrarAtivo,
  atualizarAtivo,
  listarAtivos,
  listarAtivoPorID,
};
