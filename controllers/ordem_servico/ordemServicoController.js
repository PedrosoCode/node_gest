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
      observacao 
    } = req.body;
    
    const codigo_empresa = decoded.codigo_empresa;
    const codigo_usuario = decoded.id;

    // mudança de proc para função, agora ela retorna o código da OS
    const [result] = await sequelize.query(`
        SELECT sp_ordem_servico_insert_os(
          :p_codigo_empresa           ::INTEGER,
          :p_codigo_parceiro_negocio  ::INTEGER,
          :p_codigo_ativo             ::BIGINT,
          :p_observacao               ::TEXT,
          CURRENT_DATE                ::DATE,
          CURRENT_DATE                ::DATE,
          :p_codigo_usuario_ultima_alteracao  ::BIGINT
      ) AS codigo_ordem_servico
    `, {
      replacements: {
        p_codigo_empresa                  : codigo_empresa,
        p_codigo_parceiro_negocio         : codigo_cliente,
        p_codigo_ativo                    : codigo_ativo,
        p_observacao                      : observacao,
        p_codigo_usuario_ultima_alteracao : codigo_usuario
      },
    });

    // Captura o código da ordem de serviço criada
    const codigo_ordem_servico = result[0].codigo_ordem_servico;

    res.status(201).json({ codigo_ordem_servico });  // Envia o código da OS de volta para o front
  } catch (err) {
    console.error('Erro ao criar OS:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const criarItensAoCriarOS = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {
      codigo_item,
      codigo_ordem_servico,
      valor_unitario,
      quantidade_item,
      } = req.body;
    const codigo_empresa = decoded.codigo_empresa;
    const codigo_usuario = decoded.id;

    await sequelize.query(`
          CALL sp_ordem_servico_insert_os_item_criacao(
          :p_codigo_empresa                    ::integer,
          :p_codigo_os                         ::bigint,
          :p_codigo_item                       ::bigint,
          :p_valor                             ::numeric(12,2),
          :p_quantidade                        ::numeric(12,2),
          CURRENT_DATE                         ::DATE,
          :p_codigo_usuario_ultima_alteracao   ::BIGINT
        )
    `, {
      replacements: {
        p_codigo_empresa 					          : codigo_empresa,
        p_codigo_os 	                      : codigo_ordem_servico,
        p_codigo_item						            : codigo_item,
        p_valor 						                : valor_unitario,
        p_quantidade                        : quantidade_item,
        p_codigo_usuario_ultima_alteracao   : codigo_usuario,
      },
    });

    res.status(201).send('OS criada com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const editarDadosOS = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {
      body_codigo_os,
      body_codigo_cliente,
      body_codigo_ativo,
      body_observacao,
    } = req.body;
      
    const codigo_empresa = decoded.codigo_empresa;
    const codigo_usuario = decoded.id;

    await sequelize.query(`
          CALL sp_ordem_servico_update_dados(
          :p_codigo_ordem_servico             ::BIGINT,
          :p_codigo_empresa                   ::INT,
          :p_codigo_cliente                   ::INT,
          :p_codigo_ativo                     ::INT,
          :p_observacao                       ::VARCHAR,
          :p_codigo_usuario_ultima_alteracao  ::INT)`, 
    {
      replacements: {
        p_codigo_ordem_servico             :body_codigo_os,
        p_codigo_empresa                   :codigo_empresa,
        p_codigo_cliente                   :body_codigo_cliente,
        p_codigo_ativo                     :body_codigo_ativo,
        p_observacao                       :body_observacao,
        p_codigo_usuario_ultima_alteracao  :codigo_usuario
      },
    });

    res.status(201).send('OS editada com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const editarItemOS = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {
      body_codigo_item,
      body_codigo_os,
      body_codigo_item_estoque,
      body_quantidade,
      body_valor_unitario,
    } = req.body;
      
    const codigo_empresa = decoded.codigo_empresa;
    const codigo_usuario = decoded.id;    

    await sequelize.query(`
          CALL sp_ordem_servico_update_item(
          :p_codigo_item                      ::BIGINT,
          :p_codigo_empresa                   ::INT,
          :p_codigo_os                        ::INT,
          :p_codigo_item_estoque              ::INT,
          :p_quantidade                       ::DOUBLE PRECISION,
          :p_valor_unitario                   ::DOUBLE PRECISION,
          :p_codigo_usuario_ultima_alteracao  ::BIGINT)`, 
    {
      replacements: {
        p_codigo_item                       : body_codigo_item ,
        p_codigo_os                         : body_codigo_os ,
        p_codigo_item_estoque               : body_codigo_item_estoque , 
        p_quantidade                        : body_quantidade ,
        p_valor_unitario                    : body_valor_unitario ,
        p_codigo_usuario_ultima_alteracao   : codigo_usuario ,
      },
    });

    res.status(201).send(' Itens da OS editados com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const loadDados = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const codigo_empresa = decoded.codigo_empresa;
    const codigo_os = req.params.codigo_os;

    const [dados_os] = await sequelize.query(
      `SELECT * FROM fn_ordem_servico_load_dados(
        :p_codigo_empresa   ::BIGINT, 
        :p_codigo_os        ::BIGINT
      )`, 
      {
        replacements: {
          p_codigo_empresa  : codigo_empresa,
          p_codigo_os       : codigo_os
        },
      }
    );  
    
    console.log('items retornados:', dados_os);

    if (!dados_os || dados_os.length === 0) {
      return res.status(404).send('Nenhum dado encontrado para essa OS.');
    }

    res.json(dados_os); 
  } catch (err) {
    console.error('Erro ao listar item_os:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const loadItemOs = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const codigo_empresa = decoded.codigo_empresa;
    const codigo_os = req.params.codigo_os;
    

    const [item_os] = await sequelize.query(
      `SELECT * FROM fn_ordem_servico_load_item(
        :p_codigo_empresa::BIGINT, 
        :p_codigo_os::BIGINT
      )`, 
      {
        replacements: {
          p_codigo_empresa: codigo_empresa,
          p_codigo_os: codigo_os
        },
      }
    );  
    
    console.log('items retornados:', item_os);

    if (!item_os || item_os.length === 0) {
      return res.status(404).send('Nenhum item encontrado para essa OS.');
    }

    res.json(item_os); 
  } catch (err) {
    console.error('Erro ao listar item_os:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  listaAtivoPorCliente,
  listarItens,
  criarOs,
  criarItensAoCriarOS,
  loadItemOs,
  loadDados,
  editarDadosOS,
  editarItemOS
};
