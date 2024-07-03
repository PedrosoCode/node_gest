const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

const cadastrarUsuario = async (req, res) => {
  const { username, email, password } = req.body; // Certifique-se de que os nomes dos campos correspondem ao frontend
  try {
    if (!password) {
      throw new Error('Password is required');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO tb_cad_usuario (usuario, email, senha) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).send('Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error.message);
    res.status(500).send(`Erro no servidor: ${error.message}`);
  }
};

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Tentativa de login com:', email); // Log para depuração

    const user = await pool.query('SELECT * FROM tb_cad_usuario WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    console.log('Usuário encontrado:', user.rows[0]); // Log para depuração

    const validPassword = await bcrypt.compare(password, user.rows[0].senha);

    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.rows[0].codigo }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).send(`Erro no servidor: ${error.message}`);
  }
};

const obterUsuario = async (req, res) => {
  try {
    const userId = req.user.id;
    const usuario = await pool.query('SELECT id, username, email FROM tb_cad_usuario WHERE id = $1', [userId]);
    res.json(usuario.rows[0]);
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
};

const verificarToken = async (req, res) => {
  res.json({ valido: true });
};

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  obterUsuario,
  verificarToken,
};

