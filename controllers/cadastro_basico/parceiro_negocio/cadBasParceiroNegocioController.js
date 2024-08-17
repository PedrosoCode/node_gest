const pool = require('../../../config/db');
const decodeJWT = require('../../../utils/jwtDecode');


const cadastrarParceiroNegocio = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro } = req.body;
    const codigo_empresa = decoded.codigo_empresa;

    const queryParams = [
      String(nome_razao_social),
      Boolean(is_cnpj),
      String(documento),
      String(endereco),
      String(cidade),
      String(estado),
      String(cep),
      String(telefone),
      String(email),
      String(tipo_parceiro),
      Number(codigo_empresa)
    ];

    await pool.query(
      'CALL public.sp_cadastro_basico_parceiro_negocio($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      queryParams
    );

    res.status(201).send('Parceiro de negócio cadastrado com sucesso');
  } catch (err) {
    console.error('Erro ao cadastrar parceiro de negócio:', err.message);
    res.status(500).send('Erro no servidor');
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
