const pool = require('../config/db');

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT * FROM tb_cad_usuario');
    res.json(usuarios.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const cadastrarUsuario = async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
  
      await pool.query('CALL sp_usuario_cadastro($1, $2, $3)', [nome, email, senha]);
  
      const novoUsuario = await pool.query('SELECT * FROM tb_cad_usuario WHERE email = $1', [email]);
      res.json(novoUsuario.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { senha } = req.body;

    const usuarioExistente = await pool.query('SELECT * FROM tb_cad_usuario WHERE id = $1', [id]);
    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json('Usuário não encontrado');
    }

    await pool.query('CALL sp_usuario_atualizar_senha($1, $2)', [id, senha]);

    const usuarioAtualizado = await pool.query('SELECT * FROM tb_cad_usuario WHERE id = $1', [id]);
    res.json(usuarioAtualizado.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
};
