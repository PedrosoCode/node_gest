const sequelize = require('../../../config/db');
const decodeJWT = require('../../../utils/jwtDecode');

const cadastrarItemEstoque = async (req, res) => {
  try {
    // Decodificar o token JWT para obter o código da empresa
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { nome_item, preco_base_venda, custo } = req.body;
    const codigo_empresa = decoded.codigo_empresa;

    // Chamar a stored procedure para inserir o item de estoque
    await sequelize.query(`
      CALL sp_insert_cadastro_basico_item_estoque(
        :p_nome_item             ::character varying,
        :p_preco_base_venda      ::numeric,
        :p_custo                 ::numeric,
        :p_codigo_empresa        ::integer
      )
    `, {
      replacements: {
        p_nome_item: nome_item,
        p_preco_base_venda: preco_base_venda,
        p_custo: custo,
        p_codigo_empresa: codigo_empresa
      }
    });

    res.status(201).send('Item de estoque cadastrado com sucesso');
  } catch (err) {
    console.error('Erro ao cadastrar item de estoque:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  cadastrarItemEstoque
};
