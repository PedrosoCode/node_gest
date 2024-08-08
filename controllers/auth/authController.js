const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

const cadastrarUsuario = async (req, res) => {
  const { username, email, password, codigo_empresa } = req.body;
  try {
    if (!password) {
      throw new Error('Password is required');
    }

    // Verificar se o e-mail já está cadastrado para a mesma empresa
    const existingUser = await pool.query(
      'SELECT * FROM tb_cad_usuario WHERE email = $1 AND codigo_empresa = $2',
      [email, codigo_empresa]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'E-mail já cadastrado para esta empresa' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO tb_cad_usuario (usuario, email, senha, codigo_empresa) VALUES ($1, $2, $3, $4)',
      [username, email, hashedPassword, codigo_empresa]
    );

    res.status(201).send('Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error.message);
    res.status(500).send(`Erro no servidor: ${error.message}`);
  }
};

const loginUsuario = async (req, res) => {
  const { email, password, codigo_empresa } = req.body;
  try {
    console.log('Tentativa de login com:', email);

    const user = await pool.query(
      'SELECT * FROM tb_cad_usuario WHERE email = $1 AND codigo_empresa = $2',
      [email, codigo_empresa]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado para a empresa selecionada' });
    }

    console.log('Usuário encontrado:', user.rows[0]);

    const validPassword = await bcrypt.compare(password, user.rows[0].senha);

    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.rows[0].codigo, codigo_empresa: user.rows[0].codigo_empresa },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).send(`Erro no servidor: ${error.message}`);
  }
};

const obterUsuario = async (req, res) => {
  try {
    const userId = req.user.id;
    const usuario = await pool.query(
      'SELECT codigo, usuario, email, codigo_empresa FROM tb_cad_usuario WHERE codigo = $1',
      [userId]
    );
    res.json(usuario.rows[0]);
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
};

const listarEmpresas = async (req, res) => {
  try {
    const empresas = await pool.query('SELECT codigo, razao_social FROM tb_info_empresa');
    res.json(empresas.rows);
  } catch (error) {
    console.error('Erro ao listar empresas:', error.message);
    res.status(500).send('Erro no servidor');
  }
};

const verificarToken = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Acesso Negado');
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valido: true, dados: verificado });
  } catch (error) {
    res.status(400).send('Token Inválido');
  }
};

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  obterUsuario,
  verificarToken,
  listarEmpresas,
};
