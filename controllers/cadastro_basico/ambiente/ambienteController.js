const pool = require('../../../config/db');

const cadastrarAmbiente = async (req, res) => {
  try {
    const { nome_ambiente } = req.body;

    await pool.query('CALL sp_cadastro_basico_ambiente($1)', [nome_ambiente]);

    res.status(201).send('Ambiente cadastrado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const atualizarAmbiente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_ambiente } = req.body;

    const ambienteExistente = await pool.query('SELECT * FROM tb_ambientes WHERE id = $1', [id]);
    if (ambienteExistente.rows.length === 0) {
      return res.status(404).json('Ambiente não encontrado');
    }

    await pool.query('CALL sp_update_cadastro_basico_ambiente($1, $2)', [id, nome_ambiente]);

    const ambienteAtualizado = await pool.query('SELECT * FROM tb_ambientes WHERE id = $1', [id]);
    res.json(ambienteAtualizado.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  cadastrarAmbiente,
  atualizarAmbiente,
};
