const sequelize = require('../../../config/db'); // Ajuste o caminho para o arquivo de configuração do Sequelize
const decodeJWT = require('../../../utils/jwtDecode');

const cadastrarParceiroNegocio = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {
      nome_razao_social,
      is_cnpj,
      documento,
      endereco,
      cidade,
      estado,
      cep,
      telefone,
      email,
      tipo_parceiro,
    } = req.body;
    const codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(
      'CALL sp_cadastro_basico_parceiro_negocio(:nome_razao_social, :is_cnpj, :documento, :endereco, :cidade, :estado, :cep, :telefone, :email, :tipo_parceiro, :codigo_empresa)',
      {
        replacements: {
          nome_razao_social,
          is_cnpj,
          documento,
          endereco,
          cidade,
          estado,
          cep,
          telefone,
          email,
          tipo_parceiro,
          codigo_empresa,
        },
      }
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
    const {
      nome_razao_social,
      is_cnpj,
      documento,
      endereco,
      cidade,
      estado,
      cep,
      telefone,
      email,
      tipo_parceiro,
      codigo_empresa,
    } = req.body;

    await sequelize.query(
      'CALL sp_atualizar_parceiro_negocio(:id, :nome_razao_social, :is_cnpj, :documento, :endereco, :cidade, :estado, :cep, :telefone, :email, :tipo_parceiro, :codigo_empresa)',
      {
        replacements: {
          id,
          nome_razao_social,
          is_cnpj,
          documento,
          endereco,
          cidade,
          estado,
          cep,
          telefone,
          email,
          tipo_parceiro,
          codigo_empresa,
        },
      }
    );

    res.status(200).send('Parceiro de negócio atualizado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarParceirosNegocio = async (req, res) => {
  try {
    const [parceiros] = await sequelize.query('SELECT * FROM tb_cad_parceiro_negocio');
    res.json(parceiros);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarParceiroNegocioPorID = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [parceiro] = await sequelize.query('SELECT * FROM tb_cad_parceiro_negocio WHERE codigo = :id', {
      replacements: { id },
    });

    if (!parceiro.length) {
      return res.status(404).json('Parceiro de negócio não encontrado');
    }
    res.json(parceiro[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const deletarParceiroNegocio = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { id } = req.params;
    const codigo_empresa = decoded.codigo_empresa;

    await sequelize.query('CALL sp_deletar_parceiro_negocio(:codigo, :codigo_empresa)', {
      replacements: { codigo: id, codigo_empresa },
    });

    res.status(200).send('Parceiro de negócio deletado com sucesso');
  } catch (err) {
    console.error('Erro ao deletar parceiro de negócio:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  cadastrarParceiroNegocio,
  atualizarParceiroNegocio,
  listarParceirosNegocio,
  listarParceiroNegocioPorID,
  deletarParceiroNegocio,
};
