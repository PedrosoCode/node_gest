// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ModUsuario = require('../../models/ModUsuario');
const ModEmpresa = require('../../models/ModEmpresa');

const cadastrarUsuario = async (req, res) => {
  const { username, email, password, codigo_empresa } = req.body;
  try {
    if (!password) {
      throw new Error('Password is required');
    }

    // Verificar se o e-mail já está cadastrado para a mesma empresa
    const existingUser = await ModUsuario.findOne({
      where: { email, codigo_empresa }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado para esta empresa' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await ModUsuario.create({
      usuario: username,
      email,
      senha: hashedPassword,
      codigo_empresa
    });

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

    const user = await ModUsuario.findOne({
      where: { email, codigo_empresa }
    });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado para a empresa selecionada' });
    }

    console.log('Usuário encontrado:', user);

    const validPassword = await bcrypt.compare(password, user.senha);

    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.codigo, codigo_empresa: user.codigo_empresa },
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
    const usuario = await ModUsuario.findByPk(userId, {
      attributes: ['codigo', 'usuario', 'email', 'codigo_empresa']
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
};

const listarEmpresas = async (req, res) => {
  try {
    const empresas = await ModEmpresa.findAll({
      attributes: ['codigo', 'razao_social']
    });
    res.json(empresas);
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
