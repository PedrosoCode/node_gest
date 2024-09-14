const sequelize = require('../../config/db'); 
const decodeJWT = require('../../utils/jwtDecode');

const listaAtivoPorCliente = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const codigo_empresa = decoded.codigo_empresa;
    const { codigo_cliente } = req.params;

    // Adicionando logs para verificar se os parâmetros estão corretos
    console.log('codigo_empresa:', codigo_empresa);
    console.log('codigo_cliente:', codigo_cliente);

    // Chamada da procedure com os parâmetros corretos
    const [ativos] = await sequelize.query(
      `SELECT * FROM fn_listar_ativos(:p_codigo_empresa, :p_codigo_cliente)`, 
      {
        replacements: {
          p_codigo_empresa: codigo_empresa,
          p_codigo_cliente: codigo_cliente
        },
      }
    );
    
    
    console.log('Ativos retornados:', ativos);

    if (!ativos || ativos.length === 0) {
      return res.status(404).send('Nenhum ativo encontrado para esse cliente.');
    }

    res.json(ativos); 
  } catch (err) {
    console.error('Erro ao listar ativos:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarItens = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const codigo_empresa = decoded.codigo_empresa;

    const [itens] = await sequelize.query(
      `SELECT * FROM fn_listar_itens(:p_codigo_empresa::INTEGER)`,
      {
        replacements: {
          p_codigo_empresa: codigo_empresa
        },
      }
    );

    res.json(itens);
  } catch (err) {
    console.error('Erro ao listar itens:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const criarOs = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {  
      codigo_cliente, 
      codigo_ativo, 
      observacao} = req.body;
    const codigo_empresa = decoded.codigo_empresa;
    const codigo_usuario = decoded.id;

    await sequelize.query(`
        CALL sp_ordem_servico_insert_os(
          :p_codigo_empresa                   ::INTEGER,
          :p_codigo_parceiro_negocio          ::INTEGER,
          :p_codigo_ativo                     ::BIGINT,
          :p_observacao                       ::TEXT,
          CURRENT_DATE                        ::DATE,
          CURRENT_DATE                        ::DATE,
          :p_codigo_usuario_ultima_alteracao  ::BIGINT
      )
    `, {
      replacements: {
        p_codigo_empresa 					          : codigo_empresa ,
        p_codigo_parceiro_negocio 	        : codigo_cliente ,
        p_codigo_ativo						          : codigo_ativo ,
        p_observacao 						            : observacao ,
        p_codigo_usuario_ultima_alteracao   : codigo_usuario
      },
    });

    res.status(201).send('OS criada com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  listaAtivoPorCliente,
  listarItens,
  criarOs,
};
