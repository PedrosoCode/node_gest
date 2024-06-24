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

module.exports = {
  cadastrarAmbiente,
};
