const sequelize = require('../../../config/db');
const decodeJWT = require('../../../utils/jwtDecode');

const cadastrarAtivo = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { codigo_cliente, 
            numero_serie, 
            codigo_fabricante, 
            modelo, 
            codigo_prioridade, 
            codigo_tecnico_responsavel, 
            observacao, 
            nivel_manutencao } = req.body;
    const codigo_empresa = decoded.codigo_empresa;

    await sequelize.query(`
      CALL sp_insert_cadastro_basico_ativo(
        :p_codigo_cliente             ::integer, 
        :p_numero_serie               ::character varying, 
        :p_codigo_fabricante          ::integer, 
        :p_modelo                     ::character varying, 
        :p_codigo_prioridade          ::smallint, 
        :p_codigo_tecnico_responsavel ::integer, 
        :p_observacao                 ::character varying, 
        :p_nivel_manutencao           ::boolean, 
        :p_codigo_empresa             ::integer
      )
    `, {
      replacements: {
        p_codigo_cliente:             codigo_cliente, 
        p_numero_serie:               numero_serie, 
        p_codigo_fabricante:          codigo_fabricante, 
        p_modelo:                     modelo, 
        p_codigo_prioridade:          codigo_prioridade, 
        p_codigo_tecnico_responsavel: codigo_tecnico_responsavel, 
        p_observacao:                 observacao, 
        p_nivel_manutencao:           nivel_manutencao, 
        p_codigo_empresa:             codigo_empresa
      },
    });

    res.status(201).send('Ativo cadastrado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const atualizarAtivo = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { id } = req.params;
    const { 
      codigo_cliente, 
      numero_serie, 
      codigo_fabricante, 
      modelo, 
      codigo_prioridade, 
      codigo_tecnico_responsavel, 
      observacao, 
      nivel_manutencao 
    } = req.body;

    const codigo_empresa = decoded.codigo_empresa;

    const [ativoExistente] = await sequelize.query('SELECT * FROM tb_cad_ativo WHERE codigo = :id AND codigo_empresa = :codigo_empresa', {
      replacements: { id, codigo_empresa },
    });

    if (ativoExistente.length === 0) {
      return res.status(404).json('Ativo não encontrado');
    }


    //REVIEW - rever a query 
    //TODO - trocar o nome da tabela para tb_cad_ativo
    //FIXME - Repetir o mesmo caso abaixo, passando a tipagem explicitamente para a procedure para evitar erros de tipo unknown

    await sequelize.query(`
    CALL sp_update_cadastro_basico_ativo_v2(
      :p_codigo                     ::integer, 
      :p_codigo_cliente             ::integer, 
      :p_numero_serie               ::character varying, 
      :p_codigo_fabricante          ::integer, 
      :p_modelo                     ::character varying, 
      :p_codigo_prioridade          ::smallint, 
      :p_codigo_tecnico_responsavel ::integer, 
      :p_observacao                 ::character varying, 
      :p_nivel_manutencao           ::boolean, 
      :p_codigo_empresa             ::integer
    )
  `, {
      replacements: {
        p_codigo:                     id,
        p_codigo_cliente:             codigo_cliente, 
        p_numero_serie:               numero_serie, 
        p_codigo_fabricante:          codigo_fabricante, 
        p_modelo:                     modelo,
        p_codigo_prioridade:          codigo_prioridade, 
        p_codigo_tecnico_responsavel: codigo_tecnico_responsavel,
        p_observacao:                 observacao, 
        p_nivel_manutencao:           nivel_manutencao,
        p_codigo_empresa:             codigo_empresa
      }
    }
  );

    const [ativoAtualizado] = await sequelize.query('SELECT * FROM tb_cad_ativo WHERE codigo = :id AND codigo_empresa = :codigo_empresa', {
      replacements: { id, codigo_empresa },
    });

    res.json(ativoAtualizado[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const listarAtivos = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const codigo_empresa = decoded.codigo_empresa;

    const [ativos] = await sequelize.query('SELECT * FROM tb_cad_ativo WHERE codigo_empresa = :codigo_empresa', {
      replacements: { codigo_empresa },
    });
    res.json(ativos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const listarAtivoPorID = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { id } = req.params;
    const codigo_empresa = decoded.codigo_empresa;

    const [ativo] = await sequelize.query('SELECT * FROM tb_cad_ativo WHERE codigo = :id AND codigo_empresa = :codigo_empresa', {
      replacements: { id, codigo_empresa },
    });

    if (ativo.length === 0) {
      return res.status(404).json('Ativo não encontrado');
    }
    res.json(ativo[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deletarAtivo = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { id } = req.params;
    const codigo_empresa = decoded.codigo_empresa;

    const [ativoExistente] = await sequelize.query('SELECT * FROM tb_cad_ativo WHERE codigo = :id AND codigo_empresa = :codigo_empresa', {
      replacements: { id, codigo_empresa },
    });

    if (ativoExistente.length === 0) {
      return res.status(404).json('Ativo não encontrado');
    }

    await sequelize.query('DELETE FROM tb_cad_ativo WHERE codigo = :id AND codigo_empresa = :codigo_empresa', {
      replacements: { id, codigo_empresa },
    });

    res.status(200).send('Ativo deletado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const listarTecnicos = async (req, res) => {
  try {
    const [tecnicos] = await sequelize.query('SELECT codigo, nome FROM tb_cad_tecnico');
    res.json(tecnicos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const buscarPrioridade = async (req, res) => {
  try {
    const [prioridade] = await sequelize.query('SELECT * FROM fn_buscar_prioridade()');
    res.json(prioridade);
  } catch (err) {
    console.error(err.message);  // Log completo do erro
    res.status(500).send('Server Error');
  }
};

module.exports = {
  cadastrarAtivo,
  atualizarAtivo,
  listarAtivos,
  listarAtivoPorID,
  deletarAtivo,
  listarTecnicos,
  buscarPrioridade,
};
