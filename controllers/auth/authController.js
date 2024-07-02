const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

const cadastrarUsuario = async (req, res) => {
  const { usuario, email, senha } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    await pool.query(
      'INSERT INTO tb_cad_usuario (usuario, email, senha) VALUES ($1, $2, $3)',
      [usuario, email, hashedPassword]
    );

    res.status(201).send('Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error.message);
    res.status(500).send('Erro no servidor');
  }
};

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await pool.query('SELECT * FROM tb_cad_usuario WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(senha, user.rows[0].senha);

    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.rows[0].codigo }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  cadastrarUsuario,
  loginUsuario,
};
