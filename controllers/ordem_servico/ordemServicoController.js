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
  
      // Adiciona logs para verificar os parâmetros
      console.log('codigo_empresa:', codigo_empresa);
      console.log('codigo_cliente:', codigo_cliente);
  
      const [ativos] = await sequelize.query(
        `CALL fn_listar_ativos(
          :p_codigo_empresa ::integer, 
          :p_codigo_cliente ::integer
        )`, 
        {
          replacements: {
            p_codigo_empresa: codigo_empresa,
            p_codigo_cliente: codigo_cliente
          },
        }
      );
  
      if (ativos.length === 0) {
        return res.status(404).send('Nenhum ativo encontrado para esse cliente.');
      }
  
      res.json(ativos);
  
    } catch (err) {
      console.error('Erro ao listar ativos:', err.message);
      res.status(500).send('Erro no servidor');
    }
};

  
  
  
module.exports = {
    listaAtivoPorCliente
};
