const sequelize = require('../../config/db');
const decodeJWT = require('../../utils/jwtDecode');
const path = require('path');

const novaNM = async (req, res) => {
  try {
    // Decodificar o token JWT para obter o código da empresa
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { body_solicitante,
            body_descricao,
            body_observacao,
            body_codigo_parceiro_negocio,
            body_nome_contato,
            body_metodo_contato, } = req.body;
    const jwt_codigo_empresa = decoded.codigo_empresa;
    const jwt_codigo_usuario = decoded.id;

    await sequelize.query(`
      CALL sp_necessidade_manutencao_insert(
        :p_codigo_empresa           ::integer,
        :p_solicitante	            ::varchar,
        :p_descricao		            ::varchar,
        :p_observacao		            ::varchar,
        :p_codigo_parceiro_negocio  ::integer,
        :p_nome_contato             ::varchar,
        :p_metodo_contato           ::varchar,
        :p_codigo_usuario           ::integer
      )
    `, {
      replacements: {
        p_codigo_empresa            : jwt_codigo_empresa,
        p_solicitante               : body_solicitante,
        p_descricao                 : body_descricao,
        p_observacao                : body_observacao,
        p_codigo_parceiro_negocio   : body_codigo_parceiro_negocio,
        p_nome_contato              : body_nome_contato,
        p_metodo_contato            : body_metodo_contato,
        p_codigo_usuario            : jwt_codigo_usuario,
      }
    });

    res.status(201).send('Operação realizada com sucesso');
  } catch (err) {
    console.error('Erro ao realizar operação:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const deletarNM = async (req, res) => {
  try {
    // Decodificar o token JWT para obter o código da empresa
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { body_codigo_nm } = req.body;
    const jwt_codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(`
      CALL sp_necessidade_manutencao_delete_nm(
        :p_codigo_nm           ::integer,
        :p_codigo_empresa	     ::integer
      )
    `, {
      replacements: {
        p_codigo_empresa  :  jwt_codigo_empresa ,
        p_codigo_nm       :  body_codigo_nm     ,
      }
    });

    res.status(201).send('Operação realizada com sucesso');
  } catch (err) {
    console.error('Erro ao realizar delete:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const atualizarNM = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { 
            body_codigo_nm               ,
            body_solicitante             ,
            body_aprovador               ,
            body_descricao               ,
            body_observacao              ,
            body_codigo_parceiro_negocio ,
            body_nome_contato            ,
            body_metodo_contato          ,
            body_codigo_tipo_manutencao   ,
            body_codigo_nivel_prioridade ,
            body_desconto_bruto_geral    ,
            body_acrescimo_bruto_geral   ,
          } = req.body;
    const jwt_codigo_empresa = decoded.codigo_empresa;
    const jwt_codigo_usuario = decoded.id;
    
    await sequelize.query(`
      CALL sp_necessidade_manutencao_update(
        :p_codigo_nm                ::BIGINT,
        :p_codigo_empresa           ::INT,
        :p_solicitante              ::VARCHAR,
        :p_aprovador                ::VARCHAR,
        :p_descricao                ::TEXT,
        :p_observacao               ::TEXT,
        :p_codigo_parceiro_negocio  ::INTEGER,
        :p_nome_contato             ::VARCHAR,
        :p_metodo_contato           ::VARCHAR,
        :p_codigo_usuario           ::INTEGER,
        :p_codigo_tipo_manutencao   ::INTEGER,
        :p_codigo_nivel_prioridade  ::INTEGER,
        :p_desconto_bruto_geral     ::NUMERIC,
        :p_acrescimo_bruto_geral    ::NUMERIC
      )
    `, {
      replacements: {
        p_codigo_nm                : body_codigo_nm               ,
        p_codigo_empresa           : jwt_codigo_empresa           ,
        p_solicitante              : body_solicitante             ,
        p_aprovador                : body_aprovador               ,
        p_descricao                : body_descricao               ,
        p_observacao               : body_observacao              ,
        p_codigo_parceiro_negocio  : body_codigo_parceiro_negocio ,
        p_nome_contato             : body_nome_contato            ,
        p_metodo_contato           : body_metodo_contato          ,
        p_codigo_usuario           : jwt_codigo_usuario           ,
        p_codigo_tipo_manutencao   : body_codigo_tipo_manutencao  ,
        p_codigo_nivel_prioridade  : body_codigo_nivel_prioridade ,
        p_desconto_bruto_geral     : body_desconto_bruto_geral    ,
        p_acrescimo_bruto_geral    : body_acrescimo_bruto_geral   ,
      }
    });

    res.status(201).send('NM atualizada com sucesso');
  } catch (err) {
    console.error('Erro ao atualizar a NM:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para upload de foto de ativo
const uploadFoto = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { body_codigo_ativo_vinculado,
            body_codigo_nm,
            body_titulo,
    } = req.body; 
    const jwt_codigo_empresa = decoded.codigo_empresa;

    // Validação se o arquivo foi carregado corretamente
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const nomeArquivo = req.file.filename;
    const caminhoCompleto = path.resolve('uploads/manutencao', nomeArquivo);

    // Chamada ao procedimento armazenado para inserir a foto
    await sequelize.query(`
      CALL sp_manutencao_necessidade_insert_ativo_imagem(
        :p_codigo_ativo_vinculado ::BIGINT,
        :p_codigo_nm              ::BIGINT,
        :p_codigo_empresa         ::INTEGER,
        :p_titulo                 ::VARCHAR,
        :p_caminho                ::VARCHAR
      )
    `, {
      replacements: {
        p_codigo_ativo_vinculado  : body_codigo_ativo_vinculado ,
        p_codigo_nm               : body_codigo_nm              ,
        p_codigo_empresa          : jwt_codigo_empresa          ,
        p_titulo                  : body_titulo                 ,
        p_caminho                 : caminhoCompleto             ,
      }
    });

    res.status(200).send('Foto enviada com sucesso');
  } catch (err) {
    console.error('Erro ao fazer upload das fotos:', err.message);
    res.status(500).send('Erro ao fazer upload das fotos');
  }
};

const carregarDadosNM = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const jwt_codigo_empresa = decoded.codigo_empresa;
    const { body_codigo_nm } = req.body;

    const [dados_nm] = await sequelize.query(
      `SELECT * FROM fn_manutencao_necessidade_listar_dados_nm(
        :p_codigo_nm        ::INT, 
        :p_codigo_empresa   ::INT
      )`, 
      {
        replacements: {
          p_codigo_empresa  : jwt_codigo_empresa,
          p_codigo_nm       : body_codigo_nm
        },
      }
    );  
    
    console.log('dados retornados:', dados_nm);

    if (!dados_nm || dados_nm.length === 0) {
      return res.status(404).send('Nenhum dado encontrado para essa OS.');
    }

    res.json(dados_nm); 
  } catch (err) {
    console.error('Erro ao listar dados_nm:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const carregarDadosNMativos = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const jwt_codigo_empresa = decoded.codigo_empresa;
    const { body_codigo_nm } = req.body;

    const [dados_nmAtivos] = await sequelize.query(
      `SELECT * FROM fn_manutecao_necessidade_select_ativo(
        :p_codigo_empresa   ::INT, 
        :p_codigo_nm        ::INT
      )`, 
      {
        replacements: {
          p_codigo_empresa  : jwt_codigo_empresa,
          p_codigo_nm       : body_codigo_nm
        },
      }
    );  
    
    console.log('dados retornados:', dados_nmAtivos);

    if (!dados_nmAtivos || dados_nmAtivos.length === 0) {
      return res.status(404).send('Nenhum dado encontrado para essa OS.');
    }

    res.json(dados_nmAtivos); 
  } catch (err) {
    console.error('Erro ao listar dados_nmAtivos:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const upsertAtivoNm = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {
      body_codigo_ativo_nm,
      body_codigo_necessidade_manutencao,
      body_codigo_ativo_referencia,
      body_descricao,
      body_observacao,
    } = req.body;
      
    const jwt_codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(`
          CALL sp_necessidade_manutencao_upsert_ativo(
           :p_codigo                          ::BIGINT    ,
           :p_codigo_necessidade_manutencao   ::BIGINT    ,
	         :p_codigo_empresa                  ::INT       ,
	         :p_codigo_ativo                    ::BIGINT    ,
	         :p_descricao                       ::TEXT      ,
	         :p_observacao                      ::TEXT)`    , 
    {
      replacements: {
        p_codigo                          : body_codigo_ativo_nm                ,
        p_codigo_necessidade_manutencao   : body_codigo_necessidade_manutencao  ,
        p_codigo_empresa                  : jwt_codigo_empresa                  ,
        p_codigo_ativo                    : body_codigo_ativo_referencia        ,
        p_descricao                       : body_descricao                      ,
        p_observacao                      : body_observacao                     ,
      },
    });

    res.status(201).send(' upsert do ativo realizado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deletarNMativo = async (req, res) => {
  try {
    // Decodificar o token JWT para obter o código da empresa
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { body_codigo_nm,
            body_codigo_ativo
    } = req.body;

    const jwt_codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(`
      CALL sp_necessidade_manutencao_delete_ativo_nm(
        :p_codigo_ativo        ::bigint,
        :p_codigo_nm           ::integer,
        :p_codigo_empresa	     ::integer
      )
    `, {
      replacements: {
        p_codigo_ativo    :  body_codigo_ativo  ,
        p_codigo_empresa  :  jwt_codigo_empresa ,
        p_codigo_nm       :  body_codigo_nm     ,
      }
    });

    res.status(201).send('Operação realizada com sucesso');
  } catch (err) {
    console.error('Erro ao realizar delete de ativo:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const upsertAtivoNmItem = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const {
      body_codigo_item_nm                , 
      body_codigo_ativo_vinculado        , 
      body_codigo_necessidade_manutencao , 
      body_codigo_item_estoque           ,  
      body_quantidade                    , 
      body_valor_unitario                , 
      body_tipo                          , 
    } = req.body;
      
    const jwt_codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(`
          CALL sp_necessidade_manutencao_upsert_ativo_item(
            :p_codigo                         ::BIGINT,
            :p_codigo_ativo_vinculado         ::BIGINT,
            :p_codigo_necessidade_manutencao  ::BIGINT,
            :p_codigo_empresa                 ::INTEGER,
            :p_codigo_item_estoque            ::BIGINT,
            :p_quantidade                     ::NUMERIC,
            :p_valor_unitario                 ::NUMERIC,
            :p_tipo                           ::CHAR(1)
            )`, 
    {
      replacements: {
        p_codigo                          : body_codigo_item_nm                ,
        p_codigo_ativo_vinculado          : body_codigo_ativo_vinculado        ,
        p_codigo_necessidade_manutencao   : body_codigo_necessidade_manutencao ,                                 
        p_codigo_empresa                  : jwt_codigo_empresa                 ,                
        p_codigo_item_estoque             : body_codigo_item_estoque           ,                       
        p_quantidade                      : body_quantidade                    ,               
        p_valor_unitario                  : body_valor_unitario                ,                   
        p_tipo                            : body_tipo                          ,         
      },
    });

    res.status(201).send(' upsert dos itens do ativo realizado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const carregarDadosItemAtivoNm = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const jwt_codigo_empresa = decoded.codigo_empresa;

    const { body_codigo_ativo_item            ,
            body_codigo_ativo_vinculado       ,
            body_codigo_necessidade_manutencao } = req.body;

    const [dadosItemAtivosNM] = await sequelize.query(
      `SELECT * FROM fn_manutencao_necessidade_select_item_ativo(
        :p_codigo                          ::BIGINT,
        :p_codigo_ativo_vinculado          ::BIGINT,
        :p_codigo_necessidade_manutencao   ::BIGINT,
        :p_codigo_empresa                  ::INTEGER
      )`, 
      {
        replacements: {
          p_codigo                        : body_codigo_ativo_item              ,
          p_codigo_ativo_vinculado        : body_codigo_ativo_vinculado         ,
          p_codigo_necessidade_manutencao : body_codigo_necessidade_manutencao  ,
          p_codigo_empresa                : jwt_codigo_empresa                  ,
        },
      }
    );  
    
    console.log('dados retornados:', dadosItemAtivosNM);

    if (!dadosItemAtivosNM || dadosItemAtivosNM.length === 0) {
      return res.status(404).send('Nenhum dado encontrado para essa OS.');
    }

    res.json(dadosItemAtivosNM); 
  } catch (err) {
    console.error('Erro ao listar dadosItemAtivosNM:', err.message);
    res.status(500).send('Erro no servidor');
  }
};


const deletarNMativoItem = async (req, res) => {
  try {
    // Decodificar o token JWT para obter o código da empresa
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { body_codigo_nm_ativo_item,
            body_codigo_ativo_vinculado,
            body_codigo_nm
    } = req.body;

    const jwt_codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(`
      CALL sp_necessidade_manutencao_delete_ativo_item_nm(
        :p_codigo_ativo_item              ::bigint,
        :p_codigo_ativo_vinculado         ::bigint,
        :p_codigo_necessidade_manutencao  ::bigint,
        :p_codigo_empresa	                ::integer
      )
    `, {
      replacements: {
        p_codigo_ativo_item               :  body_codigo_nm_ativo_item    ,
        p_codigo_ativo_vinculado          :  body_codigo_ativo_vinculado  ,
        p_codigo_necessidade_manutencao   :  body_codigo_nm               ,
        p_codigo_empresa                  :  jwt_codigo_empresa           ,
      }
    });

    res.status(201).send('Operação realizada com sucesso');
  } catch (err) {
    console.error('Erro ao realizar delete de ativo:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  novaNM,
  uploadFoto,
  atualizarNM,
  deletarNM,
  carregarDadosNM,
  carregarDadosNMativos,
  upsertAtivoNm,
  deletarNMativo,
  upsertAtivoNmItem,
  carregarDadosItemAtivoNm,
  deletarNMativoItem
};
