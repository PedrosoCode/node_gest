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

// Função para upload de foto de ativo
const uploadFoto = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { body_codigo_imagem,
            body_codigo_ativo_vinculado,
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
      CALL sp_manutencao_necessidade_upsert_ativo_imagem(
        :p_codigo                 ::INTEGER,
        :p_codigo_ativo_vinculado ::BIGINT,
        :p_codigo_nm              ::BIGINT,
        :p_codigo_empresa         ::INTEGER,
        :p_titulo                 ::VARCHAR,
        :p_caminho                ::VARCHAR
      )
    `, {
      replacements: {
        p_codigo                  : body_codigo_imagem          ,
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

module.exports = {
  novaNM,
  uploadFoto,
};
