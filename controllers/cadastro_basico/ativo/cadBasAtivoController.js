const sequelize = require('../../../config/db');
const decodeJWT = require('../../../utils/jwtDecode');
const upload = require('../../../config/uploadConfig'); // Importe o middleware de upload
const fs = require('fs');
const path = require('path');

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

const uploadFotos = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { id } = req.params; // ID do ativo, agora tratado como codigo_ativo
    const codigo_empresa = decoded.codigo_empresa;

    // Verificar se o ativo existe
    const [ativoExistente] = await sequelize.query(`
      SELECT * FROM tb_cad_ativo WHERE codigo = :id AND codigo_empresa = :codigo_empresa
    `, {
      replacements: { id, codigo_empresa },
    });

    if (ativoExistente.length === 0) {
      return res.status(404).send('Ativo não encontrado para upload de fotos');
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).send('Nenhuma foto enviada');
    }

    for (let file of req.files) {
      const caminhoCompleto = path.resolve('uploads', file.filename);

      await sequelize.query(`
        CALL sp_insert_cadastro_basico_ativo_foto(
          :p_codigo_ativo                ::integer,
          :p_codigo_empresa              ::integer,
          :p_titulo                      ::character varying,
          :p_caminho_completo            ::character varying,
          :p_descricao                   ::character varying
        )
      `, {
        replacements: {
          p_codigo_ativo: id, // ID do ativo
          p_codigo_empresa: codigo_empresa,
          p_titulo: file.originalname,
          p_caminho_completo: caminhoCompleto,
          p_descricao: null // ou forneça uma descrição adequada
        }
      });
    }

    res.status(200).send('Fotos enviadas com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao fazer upload das fotos');
  }
};

//FIXME - Delete ainda não funciona
const deletarFoto = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { id, fotoId } = req.params; // id do ativo e id da foto
    const codigo_empresa = decoded.codigo_empresa;

    const [foto] = await sequelize.query(`
      SELECT * FROM tb_cad_ativo_foto WHERE codigo = :id AND codigo_empresa = :codigo_empresa AND id = :fotoId
    `, {
      replacements: { id, codigo_empresa, fotoId },
    });

    if (foto.length === 0) {
      return res.status(404).json('Foto não encontrada');
    }

    const caminhoCompleto = foto[0].caminho_completo;

    // Remova o arquivo do sistema de arquivos
    fs.unlinkSync(caminhoCompleto);

    // Remova a entrada do banco de dados
    await sequelize.query(`
      DELETE FROM tb_cad_ativo_foto WHERE codigo = :id AND codigo_empresa = :codigo_empresa AND id = :fotoId
    `, {
      replacements: { id, codigo_empresa, fotoId },
    });

    res.status(200).send('Foto deletada com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao deletar a foto');
  }
};

const listarFotosAtivo = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = decodeJWT(token);

    if (!decoded) {
      return res.status(401).send('Token inválido ou expirado');
    }

    const { id } = req.params;
    const codigo_empresa = decoded.codigo_empresa;

    const fotos = await sequelize.query(`
      SELECT * FROM fn_listar_fotos_ativo(
        :p_codigo_ativo::integer, 
        :p_codigo_empresa::integer
      )
    `, {
      replacements: { 
        p_codigo_ativo: id, 
        p_codigo_empresa: codigo_empresa 
      },
      type: sequelize.QueryTypes.SELECT
    });

    console.log('Retorno da consulta fotos:', fotos);

    // Garante que o retorno seja tratado como um array
    const fotosArray = Array.isArray(fotos) ? fotos : [fotos];

    // Ajuste o caminho para cada foto para ser relativo à pasta de uploads
    const fotosComPath = fotosArray.map(foto => ({
      ...foto,
      caminho_completo: `/uploads/${foto.caminho_completo.split('/').pop()}`
    }));

    res.json(fotosComPath);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao buscar fotos');
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
  uploadFotos,
  deletarFoto,
  listarFotosAtivo,
};
