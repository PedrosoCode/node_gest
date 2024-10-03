const sequelize = require('../../../config/db');
const decodeJWT = require('../../../utils/jwtDecode');

const cadastrarTecnico = async (req, res) => {
  try {
    // Decodificar o token JWT para obter o código da empresa
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { body_codigo_tecnico, 
            body_nome, 
            body_ativo } = req.body;
    const codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(`
      CALL sp_cadastro_upsert_tecnico(
        :p_codigo_tecnico   ::integer,
        :p_codigo_empresa   ::integer,
        :p_nome             ::varchar,
        :p_ativo            ::boolean
      )
    `, {
      replacements: {
        p_codigo_tecnico: body_codigo_tecnico,
        p_codigo_empresa: codigo_empresa,
        p_nome:           body_nome,
        p_ativo:          body_ativo
      }
    });

    res.status(201).send('operação realizada com sucesso');
  } catch (err) {
    console.error('Erro ao realizar operação:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

const deletarTecnico = async (req, res) => {
    try {
      // Decodificar o token JWT para obter o código da empresa
      const token = req.header('Authorization')?.replace('Bearer ', '');
      const decoded = decodeJWT(token);
  
      if (!decoded) {
        return res.status(401).send('Token inválido ou expirado');
      }
  
      const { body_codigo_tecnico } = req.body;
      const codigo_empresa = decoded.codigo_empresa;
  
      await sequelize.query(`
        CALL sp_cadastro_delete_tecnico(
          :p_codigo_tecnico   ::integer,
          :p_codigo_empresa   ::integer
        )
      `, {
        replacements: {
          p_codigo_tecnico: body_codigo_tecnico,
          p_codigo_empresa: codigo_empresa
        }
      });
  
      res.status(201).send('técnico deletado sucesso');
    } catch (err) {
      console.error('Erro ao realizar operação:', err.message);
      res.status(500).send('Erro no servidor');
    }
  };

  
const listarTecnico = async (req, res) => {
    try {
      // Decodificar o token JWT para obter o código da empresa
      const token = req.header('Authorization')?.replace('Bearer ', '');
      const decoded = decodeJWT(token);
  
      if (!decoded) {
        return res.status(401).send('Token inválido ou expirado');
      }

      const codigo_empresa = decoded.codigo_empresa;
  
      const [tecnicos] = await sequelize.query(`
        select * from fn_cadastro_listar_tecnico(
          :p_codigo_empresa   ::integer
        )
      `, {
        replacements: {
          p_codigo_empresa: codigo_empresa
        }
      });

      if (tecnicos.length === 0) {
        return res.status(404).send('Nenhum técnico encontrado');
      }

      res.status(200).json(tecnicos);  
  
      res.status(201).send('técnicos retornados com sucesso');
    } catch (err) {
      console.error('Erro ao realizar operação:', err.message);
      res.status(500).send('Erro no servidor');
    }
  };

module.exports = {
    cadastrarTecnico,
    deletarTecnico,
    listarTecnico
};
