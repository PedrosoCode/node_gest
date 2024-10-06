const sequelize = require('../../config/db');
const decodeJWT = require('../../utils/jwtDecode');

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

    res.status(201).send('operação realizada com sucesso');
  } catch (err) {
    console.error('Erro ao realizar operação:', err.message);
    res.status(500).send('Erro no servidor');
  }
};


module.exports = {
    novaNM,
};
