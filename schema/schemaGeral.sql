--
-- PostgreSQL database dump
--

-- Dumped from database version 17rc1
-- Dumped by pg_dump version 17rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: fn_buscar_prioridade(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_buscar_prioridade() RETURNS TABLE(res_codigo integer, res_nivel character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY SELECT codigo, nivel FROM tb_stc_nivel_prioridade;
END;
$$;


ALTER FUNCTION public.fn_buscar_prioridade() OWNER TO postgres;

--
-- Name: fn_cadastro_listar_tecnico(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_cadastro_listar_tecnico(p_codigo_empresa integer) RETURNS TABLE(req_codigo_tecnico integer, req_nome_tecnico character varying, req_codigo_empresa integer, req_ativo boolean, req_data_input date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
		tb_cad_tecnico.codigo AS req_codigo_tecnico,
		tb_cad_tecnico.nome AS req_nome_tecnico,
		tb_cad_tecnico.codigo_empresa AS req_codigo_empresa,
		tb_cad_tecnico.ativo AS req_ativo,
		tb_cad_tecnico.data_input AS req_data_input
    FROM tb_cad_tecnico
    WHERE tb_cad_tecnico.codigo_empresa = p_codigo_empresa;
END;
$$;


ALTER FUNCTION public.fn_cadastro_listar_tecnico(p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: fn_listar_ativos(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_listar_ativos(p_codigo_empresa integer, p_codigo_cliente integer) RETURNS TABLE(codigo integer, codigo_cliente integer, numero_serie character varying, codigo_fabricante integer, modelo character varying, codigo_prioridade smallint, codigo_tecnico_responsavel integer, observacao character varying, data_input date, nivel_manutencao boolean, codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM tb_cad_ativo
    WHERE tb_cad_ativo.codigo_empresa = p_codigo_empresa
      AND tb_cad_ativo.codigo_cliente = p_codigo_cliente;
END;
$$;


ALTER FUNCTION public.fn_listar_ativos(p_codigo_empresa integer, p_codigo_cliente integer) OWNER TO postgres;

--
-- Name: fn_listar_fotos_ativo(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_listar_fotos_ativo(p_codigo_ativo integer, p_codigo_empresa integer) RETURNS TABLE(codigo integer, titulo character varying, descricao character varying, caminho_completo character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tb_cad_ativo_foto.codigo,
        tb_cad_ativo_foto.titulo,
        tb_cad_ativo_foto.descricao,
        tb_cad_ativo_foto.caminho_completo
    FROM 
        tb_cad_ativo_foto
    WHERE 
        tb_cad_ativo_foto.codigo_ativo = p_codigo_ativo
        AND tb_cad_ativo_foto.codigo_empresa = p_codigo_empresa;
END;
$$;


ALTER FUNCTION public.fn_listar_fotos_ativo(p_codigo_ativo integer, p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: fn_listar_itens(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_listar_itens(p_codigo_empresa integer) RETURNS TABLE(codigo integer, nome_item character varying, preco_base_venda numeric, codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    public.tb_cad_item.codigo,
    public.tb_cad_item.nome_item,
    public.tb_cad_item.preco_base_venda,
    public.tb_cad_item.codigo_empresa
  FROM 
    public.tb_cad_item
  WHERE 
    public.tb_cad_item.codigo_empresa = p_codigo_empresa;
END;
$$;


ALTER FUNCTION public.fn_listar_itens(p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: fn_ordem_servico_load_dados(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_ordem_servico_load_dados(p_codigo_empresa bigint, p_codigo_os bigint) RETURNS TABLE(codigo integer, codigo_empresa integer, codigo_parceiro_negocio integer, codigo_ativo integer, observacao character varying, data_criacao date, data_ultima_alteracao date, codigo_usuario_ultima_alteracao bigint, nome_razao_social character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
   	tb_manutencao_ordem_servico.codigo,
    tb_manutencao_ordem_servico.codigo_empresa,
    tb_manutencao_ordem_servico.codigo_parceiro_negocio,
    tb_manutencao_ordem_servico.codigo_ativo,
	tb_manutencao_ordem_servico.observacao,
    tb_manutencao_ordem_servico.data_criacao,
    tb_manutencao_ordem_servico.data_ultima_alteracao,
	tb_manutencao_ordem_servico.codigo_usuario_ultima_alteracao,
	tb_cad_parceiro_negocio.nome_razao_social
  FROM 
    tb_manutencao_ordem_servico
	INNER JOIN tb_cad_parceiro_negocio
	ON 	tb_cad_parceiro_negocio.codigo = tb_manutencao_ordem_servico.codigo_parceiro_negocio
	AND	tb_cad_parceiro_negocio.codigo_empresa = tb_manutencao_ordem_servico.codigo_empresa;

END;
$$;


ALTER FUNCTION public.fn_ordem_servico_load_dados(p_codigo_empresa bigint, p_codigo_os bigint) OWNER TO postgres;

--
-- Name: fn_ordem_servico_load_item(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_ordem_servico_load_item(p_codigo_empresa bigint, p_codigo_os bigint) RETURNS TABLE(codigo integer, codigo_empresa integer, codigo_ordem_servico integer, codigo_item integer, nome_item character varying, quantidade double precision, valor_unitario double precision)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
   	tb_manutencao_ordem_servico_item.codigo ,
    tb_manutencao_ordem_servico_item.codigo_empresa ,
    tb_manutencao_ordem_servico_item.codigo_ordem_servico ,
    tb_manutencao_ordem_servico_item.codigo_item ,
	tb_cad_item.nome_item ,
    tb_manutencao_ordem_servico_item.quantidade ,
    tb_manutencao_ordem_servico_item.valor_unitario 
  FROM 
    tb_manutencao_ordem_servico_item
	INNER JOIN tb_cad_item
	ON 	tb_cad_item.codigo = tb_manutencao_ordem_servico_item.codigo_item
	AND	tb_cad_item.codigo_empresa = tb_manutencao_ordem_servico_item.codigo_empresa
  WHERE tb_manutencao_ordem_servico_item.codigo_empresa = p_codigo_empresa
	AND tb_manutencao_ordem_servico_item.codigo_ordem_servico = p_codigo_os;
END;
$$;


ALTER FUNCTION public.fn_ordem_servico_load_item(p_codigo_empresa bigint, p_codigo_os bigint) OWNER TO postgres;

--
-- Name: sp_atualizar_parceiro_negocio(integer, character varying, boolean, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_atualizar_parceiro_negocio(IN p_codigo integer, IN p_nome_razao_social character varying, IN p_is_cnpj boolean, IN p_documento character varying, IN p_endereco character varying, IN p_cidade character varying, IN p_estado character varying, IN p_cep character varying, IN p_telefone character varying, IN p_email character varying, IN p_tipo_parceiro character varying, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE public.tb_cad_parceiro_negocio
    SET 
        nome_razao_social = p_nome_razao_social,
        is_cnpj = p_is_cnpj,
        documento = p_documento,
        endereco = p_endereco,
        cidade = p_cidade,
        estado = p_estado,
        cep = p_cep,
        telefone = p_telefone,
        email = p_email,
        tipo_parceiro = p_tipo_parceiro
    WHERE 
        codigo = p_codigo 
        AND codigo_empresa = p_codigo_empresa;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Parceiro de negócio não encontrado para atualização.';
    END IF;
END;
$$;


ALTER PROCEDURE public.sp_atualizar_parceiro_negocio(IN p_codigo integer, IN p_nome_razao_social character varying, IN p_is_cnpj boolean, IN p_documento character varying, IN p_endereco character varying, IN p_cidade character varying, IN p_estado character varying, IN p_cep character varying, IN p_telefone character varying, IN p_email character varying, IN p_tipo_parceiro character varying, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_cadastro_basico_ambiente(character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_cadastro_basico_ambiente(IN nome_ambiente character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO tb_ambientes (nome_ambiente)
    VALUES (nome_ambiente);
END;
$$;


ALTER PROCEDURE public.sp_cadastro_basico_ambiente(IN nome_ambiente character varying) OWNER TO postgres;

--
-- Name: sp_cadastro_delete_tecnico(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_cadastro_delete_tecnico(IN p_codigo_tecnico integer, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

	DELETE FROM tb_cad_tecnico
	WHERE 	codigo = p_codigo_tecnico
	AND		codigo_empresa = p_codigo_empresa;
 
END;
$$;


ALTER PROCEDURE public.sp_cadastro_delete_tecnico(IN p_codigo_tecnico integer, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_cadastro_upsert_tecnico(integer, integer, character varying, boolean); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_cadastro_upsert_tecnico(IN p_codigo_tecnico integer, IN p_codigo_empresa integer, IN p_nome character varying, IN p_ativo boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN

  -- Faz o UPSERT: insere um novo item ou atualiza o existente com base no conflito
  INSERT INTO tb_cad_tecnico (
    codigo,
    codigo_empresa,
    nome,
    ativo,
	data_input
  ) VALUES (
    p_codigo_tecnico,
    p_codigo_empresa,
    p_nome,
    p_ativo, 
    now()
  )
  ON CONFLICT (codigo, codigo_empresa)
  DO UPDATE SET
    nome       = EXCLUDED.nome,
    ativo 	   = EXCLUDED.ativo;
END;
$$;


ALTER PROCEDURE public.sp_cadastro_upsert_tecnico(IN p_codigo_tecnico integer, IN p_codigo_empresa integer, IN p_nome character varying, IN p_ativo boolean) OWNER TO postgres;

--
-- Name: sp_deletar_parceiro_negocio(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_deletar_parceiro_negocio(IN p_codigo integer, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.tb_cad_parceiro_negocio
    WHERE 
        codigo = p_codigo 
        AND codigo_empresa = p_codigo_empresa;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Parceiro de negócio não encontrado para exclusão.';
    END IF;
END;
$$;


ALTER PROCEDURE public.sp_deletar_parceiro_negocio(IN p_codigo integer, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_delete_cadastro_basico_ativo(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_delete_cadastro_basico_ativo(IN p_codigo_foto integer, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Deleta a foto da tabela
    DELETE FROM tb_cad_ativo_foto
    WHERE codigo = p_codigo_foto
    AND codigo_empresa = p_codigo_empresa;
    
    -- Verificação adicional opcional para garantir a exclusão
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Foto não encontrada ou já deletada';
    END IF;
END;
$$;


ALTER PROCEDURE public.sp_delete_cadastro_basico_ativo(IN p_codigo_foto integer, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_insert_cadastro_basico_ativo(integer, character varying, integer, character varying, smallint, integer, character varying, boolean, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_insert_cadastro_basico_ativo(IN p_codigo_cliente integer, IN p_numero_serie character varying, IN p_codigo_fabricante integer, IN p_modelo character varying, IN p_codigo_prioridade smallint, IN p_codigo_tecnico_responsavel integer, IN p_observacao character varying, IN p_nivel_manutencao boolean, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codigo integer;
BEGIN
    SELECT COALESCE(MAX(codigo), 0) + 1 INTO v_codigo FROM tb_cad_ativo WHERE codigo_empresa = p_codigo_empresa;

    INSERT INTO tb_cad_ativo (
        codigo,
        codigo_cliente,
        numero_serie,
        codigo_fabricante,
        modelo,
        codigo_prioridade,
        codigo_tecnico_responsavel,
        observacao,
        data_input,
        nivel_manutencao,
        codigo_empresa
    ) VALUES (
        v_codigo,
        p_codigo_cliente,
        p_numero_serie,
        p_codigo_fabricante,
        p_modelo,
        p_codigo_prioridade,
        p_codigo_tecnico_responsavel,
        p_observacao,
        CURRENT_DATE,
        p_nivel_manutencao,
        p_codigo_empresa
    );
END;
$$;


ALTER PROCEDURE public.sp_insert_cadastro_basico_ativo(IN p_codigo_cliente integer, IN p_numero_serie character varying, IN p_codigo_fabricante integer, IN p_modelo character varying, IN p_codigo_prioridade smallint, IN p_codigo_tecnico_responsavel integer, IN p_observacao character varying, IN p_nivel_manutencao boolean, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_insert_cadastro_basico_ativo_foto(integer, integer, character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_insert_cadastro_basico_ativo_foto(IN p_codigo_ativo integer, IN p_codigo_empresa integer, IN p_titulo character varying, IN p_caminho_completo character varying, IN p_descricao character varying DEFAULT NULL::character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codigo_foto integer;
BEGIN
    -- Gerar o próximo valor para o código único da foto
    SELECT COALESCE(MAX(codigo), 0) + 1 INTO v_codigo_foto FROM tb_cad_ativo_foto 
    WHERE codigo_empresa = p_codigo_empresa;

    -- Inserir novo registro de foto vinculado ao ativo
    INSERT INTO tb_cad_ativo_foto (
        codigo,
        codigo_ativo,
        codigo_empresa,
        titulo,
        caminho_completo,
        data_upload,
        descricao
    ) VALUES (
        v_codigo_foto,
        p_codigo_ativo,
        p_codigo_empresa,
        p_titulo,
        p_caminho_completo,
        CURRENT_TIMESTAMP,
        p_descricao
    );
END;
$$;


ALTER PROCEDURE public.sp_insert_cadastro_basico_ativo_foto(IN p_codigo_ativo integer, IN p_codigo_empresa integer, IN p_titulo character varying, IN p_caminho_completo character varying, IN p_descricao character varying) OWNER TO postgres;

--
-- Name: sp_insert_cadastro_basico_item_estoque(character varying, numeric, numeric, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_insert_cadastro_basico_item_estoque(IN p_nome_item character varying, IN p_preco_base_venda numeric, IN p_custo numeric, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codigo INTEGER;  -- Declarando v_codigo como INTEGER
BEGIN
  -- Obter o próximo valor de código para o item, dentro do contexto da empresa
  SELECT COALESCE(MAX(codigo), 0) + 1 INTO v_codigo
  FROM tb_cad_item
  WHERE codigo_empresa = p_codigo_empresa;

  -- Inserir o novo item de estoque
  INSERT INTO tb_cad_item (codigo, nome_item, preco_base_venda, custo, codigo_empresa, data_input)
  VALUES (v_codigo, p_nome_item, p_preco_base_venda, p_custo, p_codigo_empresa, NOW());

END;
$$;


ALTER PROCEDURE public.sp_insert_cadastro_basico_item_estoque(IN p_nome_item character varying, IN p_preco_base_venda numeric, IN p_custo numeric, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_insert_cadastro_basico_parceiro_negocio(character varying, boolean, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_insert_cadastro_basico_parceiro_negocio(IN nome_razao_social character varying, IN is_cnpj boolean, IN documento character varying, IN endereco character varying, IN cidade character varying, IN estado character varying, IN cep character varying, IN telefone character varying, IN email character varying, IN tipo_parceiro character varying, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    max_codigo INTEGER;
BEGIN-- Determina o próximo código com base no máximo código existente para o codigo_empresa específico
	SELECT COALESCE(MAX(codigo), 0) +1 INTO max_codigo 
    FROM tb_cad_parceiro_negocio 
    WHERE codigo_empresa = p_codigo_empresa;

    -- Insere o novo parceiro de negócio com o código gerado e o código da empresa fornecido
	INSERT INTO tb_cad_parceiro_negocio (
        codigo, nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro, codigo_empresa
    ) VALUES (
        max_codigo, nome_razao_social, is_cnpj, documento, endereco, cidade, estado, cep, telefone, email, tipo_parceiro, p_codigo_empresa
    );
END;
$$;


ALTER PROCEDURE public.sp_insert_cadastro_basico_parceiro_negocio(IN nome_razao_social character varying, IN is_cnpj boolean, IN documento character varying, IN endereco character varying, IN cidade character varying, IN estado character varying, IN cep character varying, IN telefone character varying, IN email character varying, IN tipo_parceiro character varying, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_manutencao_necessidade_insert_ativo_imagem(bigint, bigint, integer, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_manutencao_necessidade_insert_ativo_imagem(IN p_codigo_ativo_vinculado bigint, IN p_codigo_nm bigint, IN p_codigo_empresa integer, IN p_titulo character varying, IN p_caminho character varying)
    LANGUAGE plpgsql
    AS $$

DECLARE
 v_codigo_foto integer;
BEGIN
 	SELECT COALESCE(MAX(codigo), 0) + 1 INTO v_codigo_foto FROM tb_manutencao_necessidade_ativo_imagem 
    WHERE codigo_empresa = p_codigo_empresa;

  INSERT INTO tb_manutencao_necessidade_ativo_imagem (
    codigo,
	codigo_ativo_vinculado,
	codigo_necessidade_manutencao,
	codigo_empresa,
	titulo,
	caminho_completo,
	data_input
  ) VALUES (
    v_codigo_foto,
	p_codigo_ativo_vinculado,
	p_codigo_nm,
	p_codigo_empresa,
	p_titulo,
	p_caminho,
	now()
  );
END;
$$;


ALTER PROCEDURE public.sp_manutencao_necessidade_insert_ativo_imagem(IN p_codigo_ativo_vinculado bigint, IN p_codigo_nm bigint, IN p_codigo_empresa integer, IN p_titulo character varying, IN p_caminho character varying) OWNER TO postgres;

--
-- Name: sp_manutencao_ordem_servico_delete_item(bigint, integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_manutencao_ordem_servico_delete_item(IN p_codigo_item bigint, IN p_codigo_empresa integer, IN p_codigo_os integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM tb_manutencao_ordem_servico_item
    WHERE 	codigo = p_codigo_item 
    AND 	codigo_empresa = p_codigo_empresa
	AND 	codigo_ordem_servico = p_codigo_os;
END;
$$;


ALTER PROCEDURE public.sp_manutencao_ordem_servico_delete_item(IN p_codigo_item bigint, IN p_codigo_empresa integer, IN p_codigo_os integer) OWNER TO postgres;

--
-- Name: sp_manutencao_ordem_servico_delete_os(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_manutencao_ordem_servico_delete_os(IN p_codigo_empresa integer, IN p_codigo_os integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM tb_manutencao_ordem_servico
    WHERE 	codigo = p_codigo_os 
    AND 	codigo_empresa = p_codigo_empresa;
END;
$$;


ALTER PROCEDURE public.sp_manutencao_ordem_servico_delete_os(IN p_codigo_empresa integer, IN p_codigo_os integer) OWNER TO postgres;

--
-- Name: sp_manutencao_ordem_servico_upsert_item(integer, bigint, bigint, integer, double precision, numeric, bigint); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_manutencao_ordem_servico_upsert_item(IN p_codigo_empresa integer, IN p_codigo_os bigint, IN p_codigo_item bigint, IN p_codigo_item_estoque integer, IN p_valor_unitario double precision, IN p_quantidade numeric, IN p_codigo_usuario_ultima_alteracao bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN

  -- Faz o UPSERT: insere um novo item ou atualiza o existente com base no conflito
  INSERT INTO tb_manutencao_ordem_servico_item (
    codigo,
    codigo_empresa,
    codigo_ordem_servico,
    codigo_item,
    quantidade,
    valor_unitario,
    data_ultima_alteracao,
    codigo_usuario_ultima_alteracao
  ) VALUES (
    p_codigo_item,
    p_codigo_empresa,
    p_codigo_os,
    p_codigo_item_estoque, -- Corrigido para usar p_codigo_item em vez de p_codigo_item_estoque
    p_quantidade,
    p_valor_unitario,
    NOW(),
    p_codigo_usuario_ultima_alteracao
  )
  ON CONFLICT (codigo, codigo_empresa, codigo_ordem_servico)
  DO UPDATE SET
    codigo_item                       = EXCLUDED.codigo_item,
    quantidade                        = EXCLUDED.quantidade,
    valor_unitario                    = EXCLUDED.valor_unitario,
    data_ultima_alteracao             = NOW(),
    codigo_usuario_ultima_alteracao   = EXCLUDED.codigo_usuario_ultima_alteracao;

END;
$$;


ALTER PROCEDURE public.sp_manutencao_ordem_servico_upsert_item(IN p_codigo_empresa integer, IN p_codigo_os bigint, IN p_codigo_item bigint, IN p_codigo_item_estoque integer, IN p_valor_unitario double precision, IN p_quantidade numeric, IN p_codigo_usuario_ultima_alteracao bigint) OWNER TO postgres;

--
-- Name: sp_necessidade_manutencao_delete_nm(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_necessidade_manutencao_delete_nm(IN p_codigo_nm integer, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM tb_manutencao_necessidade
    WHERE 	codigo = p_codigo_nm 
    AND 	codigo_empresa = p_codigo_empresa;
END;
$$;


ALTER PROCEDURE public.sp_necessidade_manutencao_delete_nm(IN p_codigo_nm integer, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_necessidade_manutencao_insert(integer, character varying, character varying, character varying, integer, character varying, character varying, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_necessidade_manutencao_insert(IN p_codigo_empresa integer, IN p_solicitante character varying, IN p_descricao character varying, IN p_observacao character varying, IN p_codigo_parceiro_negocio integer, IN p_nome_contato character varying, IN p_metodo_contato character varying, IN p_codigo_usuario integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codigo integer;
BEGIN
    SELECT COALESCE(MAX(codigo), 0) + 1 INTO v_codigo FROM tb_manutencao_necessidade WHERE codigo_empresa = p_codigo_empresa;

    INSERT INTO tb_manutencao_necessidade (
        codigo,
        codigo_empresa,
        solicitante,
		descricao,
		observacao,
		codigo_parceiro_negocio,
		nome_contato,
		metodo_contato,
		data_input,
		codigo_usuario_ultima_alteracao
    ) VALUES (
		v_codigo,
		p_codigo_empresa,
		p_solicitante,
		p_descricao,
		p_observacao,
		p_codigo_parceiro_negocio,
		p_nome_contato,
		p_metodo_contato,
		now(),
		p_codigo_usuario
    );
END;
$$;


ALTER PROCEDURE public.sp_necessidade_manutencao_insert(IN p_codigo_empresa integer, IN p_solicitante character varying, IN p_descricao character varying, IN p_observacao character varying, IN p_codigo_parceiro_negocio integer, IN p_nome_contato character varying, IN p_metodo_contato character varying, IN p_codigo_usuario integer) OWNER TO postgres;

--
-- Name: sp_necessidade_manutencao_update(bigint, integer, character varying, character varying, text, text, integer, character varying, character varying, integer, integer, integer, numeric, numeric); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_necessidade_manutencao_update(IN p_codigo_nm bigint, IN p_codigo_empresa integer, IN p_solicitante character varying, IN p_aprovador character varying, IN p_descricao text, IN p_observacao text, IN p_codigo_parceiro_negocio integer, IN p_nome_contato character varying, IN p_metodo_contato character varying, IN p_codigo_usuario integer, IN p_codigo_tipo_manutencao integer, IN p_codigo_nivel_prioridade integer, IN p_desconto_bruto_geral numeric, IN p_acrescimo_bruto_geral numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tb_manutencao_necessidade
    SET 
		solicitante = p_solicitante,
		aprovador = p_aprovador,
		descricao = p_descricao,
		observacao = p_observacao,
		codigo_parceiro_negocio = p_codigo_parceiro_negocio,
		nome_contato = p_nome_contato,
		metodo_contato = p_metodo_contato,
		data_ultima_alteracao = NOW(),
		codigo_usuario_ultima_alteracao = p_codigo_usuario,
		codigo_stc_tipo_manutencao = p_codigo_tipo_manutencao,
		codigo_stc_nivel_prioridade = p_codigo_nivel_prioridade,
		desconto_bruto_geral = p_desconto_bruto_geral,
		acrescimo_bruto_geral = p_acrescimo_bruto_geral
    WHERE codigo = p_codigo_nm
	AND	codigo_empresa = p_codigo_empresa;
END;
$$;


ALTER PROCEDURE public.sp_necessidade_manutencao_update(IN p_codigo_nm bigint, IN p_codigo_empresa integer, IN p_solicitante character varying, IN p_aprovador character varying, IN p_descricao text, IN p_observacao text, IN p_codigo_parceiro_negocio integer, IN p_nome_contato character varying, IN p_metodo_contato character varying, IN p_codigo_usuario integer, IN p_codigo_tipo_manutencao integer, IN p_codigo_nivel_prioridade integer, IN p_desconto_bruto_geral numeric, IN p_acrescimo_bruto_geral numeric) OWNER TO postgres;

--
-- Name: sp_ordem_servico_insert_os(integer, integer, bigint, text, date, date, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_ordem_servico_insert_os(p_codigo_empresa integer, p_codigo_parceiro_negocio integer, p_codigo_ativo bigint, p_observacao text, p_data_criacao date, p_data_ultima_alteracao date, p_codigo_usuario_ultima_alteracao bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_codigo integer;
BEGIN
    -- Gera o próximo código da OS
    SELECT COALESCE(MAX(codigo), 0) + 1 INTO v_codigo 
    FROM tb_manutencao_ordem_servico 
    WHERE codigo_empresa = p_codigo_empresa;

    -- Insere a nova OS na tabela
    INSERT INTO tb_manutencao_ordem_servico (			 			
        codigo_empresa, 		      			
        codigo_parceiro_negocio,				
        codigo_ativo,			  			
        observacao, 			      			
        data_criacao,						
        data_ultima_alteracao,				
        codigo_usuario_ultima_alteracao,
        codigo
    ) VALUES (
        p_codigo_empresa,
        p_codigo_parceiro_negocio,
        p_codigo_ativo,
        p_observacao,
        p_data_criacao,
        p_data_ultima_alteracao,
        p_codigo_usuario_ultima_alteracao,  
        v_codigo
    );
    
    -- Retorna o código da ordem de serviço criada
    RETURN v_codigo;
END;
$$;


ALTER FUNCTION public.sp_ordem_servico_insert_os(p_codigo_empresa integer, p_codigo_parceiro_negocio integer, p_codigo_ativo bigint, p_observacao text, p_data_criacao date, p_data_ultima_alteracao date, p_codigo_usuario_ultima_alteracao bigint) OWNER TO postgres;

--
-- Name: sp_ordem_servico_insert_os_item_criacao(integer, bigint, bigint, numeric, numeric, date, bigint); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_ordem_servico_insert_os_item_criacao(IN p_codigo_empresa integer, IN p_codigo_os bigint, IN p_codigo_item bigint, IN p_valor numeric, IN p_quantidade numeric, IN p_data_ultima_alteracao date, IN p_codigo_usuario_ultima_alteracao bigint)
    LANGUAGE plpgsql
    AS $$
	DECLARE
    v_codigo integer;
BEGIN
    -- Gera o próximo código item
    SELECT COALESCE(MAX(codigo), 0) + 1 INTO v_codigo 
    FROM tb_manutencao_ordem_servico_item 
    WHERE codigo_empresa = p_codigo_empresa
	AND   codigo_ordem_servico = p_codigo_os;

    INSERT INTO tb_manutencao_ordem_servico_item (			 			
    	codigo ,
    	codigo_empresa ,
    	codigo_ordem_servico,
    	codigo_item ,
    	quantidade ,
    	valor_unitario ,
		data_ultima_alteracao ,
	    codigo_usuario_ultima_alteracao 
    ) VALUES (
		v_codigo,
   		p_codigo_empresa ,
   		p_codigo_os ,
   		p_codigo_item ,
   		p_quantidade ,
		p_valor,
   		p_data_ultima_alteracao ,
   		p_codigo_usuario_ultima_alteracao 
	
    );
    
END;
$$;


ALTER PROCEDURE public.sp_ordem_servico_insert_os_item_criacao(IN p_codigo_empresa integer, IN p_codigo_os bigint, IN p_codigo_item bigint, IN p_valor numeric, IN p_quantidade numeric, IN p_data_ultima_alteracao date, IN p_codigo_usuario_ultima_alteracao bigint) OWNER TO postgres;

--
-- Name: sp_ordem_servico_update_dados(bigint, integer, integer, integer, character varying, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_ordem_servico_update_dados(IN p_codigo_ordem_servico bigint, IN p_codigo_empresa integer, IN p_codigo_cliente integer, IN p_codigo_ativo integer, IN p_observacao character varying, IN p_codigo_usuario_ultima_alteracao integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tb_manutencao_ordem_servico
    SET codigo_parceiro_negocio 			= p_codigo_cliente,
        codigo_ativo		 				= p_codigo_ativo,
        observacao 							= p_observacao,
        data_ultima_alteracao 				= NOW(),
        codigo_usuario_ultima_alteracao 	= p_codigo_usuario_ultima_alteracao
    WHERE 	codigo = p_codigo_ordem_servico 
    AND 	codigo_empresa = p_codigo_empresa;
END;
$$;


ALTER PROCEDURE public.sp_ordem_servico_update_dados(IN p_codigo_ordem_servico bigint, IN p_codigo_empresa integer, IN p_codigo_cliente integer, IN p_codigo_ativo integer, IN p_observacao character varying, IN p_codigo_usuario_ultima_alteracao integer) OWNER TO postgres;

--
-- Name: sp_ordem_servico_update_item(bigint, integer, integer, integer, double precision, double precision, bigint); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_ordem_servico_update_item(IN p_codigo_item bigint, IN p_codigo_empresa integer, IN p_codigo_os integer, IN p_codigo_item_estoque integer, IN p_quantidade double precision, IN p_valor_unitario double precision, IN p_codigo_usuario_ultima_alteracao bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tb_manutencao_ordem_servico_item
    SET 
        codigo_item 						= p_codigo_item_estoque,
		codigo_ordem_servico				= p_codigo_os,
		quantidade							= p_quantidade,
		valor_unitario						= p_valor_unitario,
        data_ultima_alteracao 				= NOW(),
        codigo_usuario_ultima_alteracao 	= p_codigo_usuario_ultima_alteracao
    WHERE 	codigo = p_codigo_item 
    AND 	codigo_empresa = p_codigo_empresa
	AND 	codigo_ordem_servico = p_codigo_os;
END;
$$;


ALTER PROCEDURE public.sp_ordem_servico_update_item(IN p_codigo_item bigint, IN p_codigo_empresa integer, IN p_codigo_os integer, IN p_codigo_item_estoque integer, IN p_quantidade double precision, IN p_valor_unitario double precision, IN p_codigo_usuario_ultima_alteracao bigint) OWNER TO postgres;

--
-- Name: sp_update_cadastro_basico_ambiente(integer, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_update_cadastro_basico_ambiente(IN ambiente_id integer, IN novo_nome_ambiente character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tb_ambientes
    SET nome_ambiente = novo_nome_ambiente
    WHERE id = ambiente_id;
END;
$$;


ALTER PROCEDURE public.sp_update_cadastro_basico_ambiente(IN ambiente_id integer, IN novo_nome_ambiente character varying) OWNER TO postgres;

--
-- Name: sp_update_cadastro_basico_ativo(integer, integer, character varying, integer, character varying, smallint, integer, character varying, boolean, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_update_cadastro_basico_ativo(IN p_codigo integer, IN p_codigo_cliente integer, IN p_numero_serie character varying, IN p_codigo_fabricante integer, IN p_modelo character varying, IN p_codigo_prioridade smallint, IN p_codigo_tecnico_responsavel integer, IN p_observacao character varying, IN p_nivel_manutencao boolean, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tb_cad_ativo_main
    SET
        codigo_cliente = p_codigo_cliente,
        numero_serie = p_numero_serie,
        codigo_fabricante = p_codigo_fabricante,
        modelo = p_modelo,
        codigo_prioridade = p_codigo_prioridade,
        codigo_tecnico_responsavel = p_codigo_tecnico_responsavel,
        observacao = p_observacao,
        nivel_manutencao = p_nivel_manutencao,
        codigo_empresa = p_codigo_empresa,
        data_input = NOW() -- Atualizando com a data e hora atual
    WHERE codigo = p_codigo;
END;
$$;


ALTER PROCEDURE public.sp_update_cadastro_basico_ativo(IN p_codigo integer, IN p_codigo_cliente integer, IN p_numero_serie character varying, IN p_codigo_fabricante integer, IN p_modelo character varying, IN p_codigo_prioridade smallint, IN p_codigo_tecnico_responsavel integer, IN p_observacao character varying, IN p_nivel_manutencao boolean, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_update_cadastro_basico_ativo_v2(integer, integer, character varying, integer, character varying, smallint, integer, character varying, boolean, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_update_cadastro_basico_ativo_v2(IN p_codigo integer, IN p_codigo_cliente integer, IN p_numero_serie character varying, IN p_codigo_fabricante integer, IN p_modelo character varying, IN p_codigo_prioridade smallint, IN p_codigo_tecnico_responsavel integer, IN p_observacao character varying, IN p_nivel_manutencao boolean, IN p_codigo_empresa integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tb_cad_ativo
    SET
        codigo_cliente = p_codigo_cliente,
        numero_serie = p_numero_serie,
        codigo_fabricante = p_codigo_fabricante,
        modelo = p_modelo,
        codigo_prioridade = p_codigo_prioridade,
        codigo_tecnico_responsavel = p_codigo_tecnico_responsavel,
        observacao = p_observacao,
        nivel_manutencao = p_nivel_manutencao,
        codigo_empresa = p_codigo_empresa,
        data_input = NOW() -- Atualizando com a data e hora atual
    WHERE codigo = p_codigo;
END;
$$;


ALTER PROCEDURE public.sp_update_cadastro_basico_ativo_v2(IN p_codigo integer, IN p_codigo_cliente integer, IN p_numero_serie character varying, IN p_codigo_fabricante integer, IN p_modelo character varying, IN p_codigo_prioridade smallint, IN p_codigo_tecnico_responsavel integer, IN p_observacao character varying, IN p_nivel_manutencao boolean, IN p_codigo_empresa integer) OWNER TO postgres;

--
-- Name: sp_usuario_atualizar_senha(integer, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_usuario_atualizar_senha(IN user_id integer, IN nova_senha character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tb_cad_usuario
    SET senha = nova_senha
    WHERE id = user_id;
END;
$$;


ALTER PROCEDURE public.sp_usuario_atualizar_senha(IN user_id integer, IN nova_senha character varying) OWNER TO postgres;

--
-- Name: sp_usuario_cadastro(character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_usuario_cadastro(IN nome character varying, IN email character varying, IN senha character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO tb_cad_usuario (nome, email, senha)
    VALUES (nome, email, senha);
END;
$$;


ALTER PROCEDURE public.sp_usuario_cadastro(IN nome character varying, IN email character varying, IN senha character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: max_codigo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.max_codigo (
    "?column?" integer
);


ALTER TABLE public.max_codigo OWNER TO postgres;

--
-- Name: tb_agendamento_ativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_agendamento_ativo (
    codigo bigint NOT NULL,
    codigo_empresa integer NOT NULL,
    codigo_agendamento integer NOT NULL,
    codigo_ativo integer
);


ALTER TABLE public.tb_agendamento_ativo OWNER TO postgres;

--
-- Name: tb_ambientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_ambientes (
    id integer NOT NULL,
    nome_ambiente character varying(255) NOT NULL
);


ALTER TABLE public.tb_ambientes OWNER TO postgres;

--
-- Name: tb_ambientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_ambientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_ambientes_id_seq OWNER TO postgres;

--
-- Name: tb_ambientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_ambientes_id_seq OWNED BY public.tb_ambientes.id;


--
-- Name: tb_cad_ativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_cad_ativo (
    codigo integer NOT NULL,
    codigo_cliente integer,
    numero_serie character varying(255),
    codigo_fabricante integer,
    modelo character varying,
    codigo_prioridade smallint,
    codigo_tecnico_responsavel integer,
    observacao character varying,
    data_input date DEFAULT CURRENT_DATE,
    nivel_manutencao boolean,
    codigo_empresa integer NOT NULL
);


ALTER TABLE public.tb_cad_ativo OWNER TO postgres;

--
-- Name: tb_cad_ativo_foto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_cad_ativo_foto (
    codigo integer NOT NULL,
    codigo_empresa integer NOT NULL,
    titulo character varying(255) NOT NULL,
    caminho_completo character varying(500) NOT NULL,
    data_upload timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    descricao character varying(255),
    codigo_ativo integer NOT NULL
);


ALTER TABLE public.tb_cad_ativo_foto OWNER TO postgres;

--
-- Name: tb_cad_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_cad_item (
    codigo integer NOT NULL,
    nome_item character varying(255) NOT NULL,
    preco_base_venda numeric(10,2) NOT NULL,
    custo numeric(10,2) NOT NULL,
    codigo_empresa integer NOT NULL,
    data_input timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tb_cad_item OWNER TO postgres;

--
-- Name: tb_cad_item_codigo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_cad_item_codigo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_cad_item_codigo_seq OWNER TO postgres;

--
-- Name: tb_cad_item_codigo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_cad_item_codigo_seq OWNED BY public.tb_cad_item.codigo;


--
-- Name: tb_cad_parceiro_negocio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_cad_parceiro_negocio (
    codigo integer NOT NULL,
    nome_razao_social character varying(255) NOT NULL,
    is_cnpj boolean NOT NULL,
    documento character varying(18) NOT NULL,
    endereco character varying(255),
    cidade character varying(100),
    estado character(2),
    cep character varying(10),
    telefone character varying(20),
    email character varying(255),
    data_cadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo_parceiro character(1) NOT NULL,
    codigo_empresa integer NOT NULL,
    CONSTRAINT tb_cad_parceiro_negocio_tipo_parceiro_check CHECK ((tipo_parceiro = ANY (ARRAY['C'::bpchar, 'F'::bpchar, 'A'::bpchar])))
);


ALTER TABLE public.tb_cad_parceiro_negocio OWNER TO postgres;

--
-- Name: tb_cad_parceiro_negocio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_cad_parceiro_negocio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_cad_parceiro_negocio_id_seq OWNER TO postgres;

--
-- Name: tb_cad_parceiro_negocio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_cad_parceiro_negocio_id_seq OWNED BY public.tb_cad_parceiro_negocio.codigo;


--
-- Name: tb_cad_tecnico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_cad_tecnico (
    codigo integer NOT NULL,
    nome character varying(255) NOT NULL,
    codigo_empresa integer NOT NULL,
    ativo boolean,
    data_input date
);


ALTER TABLE public.tb_cad_tecnico OWNER TO postgres;

--
-- Name: tb_cad_tecnico_codigo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_cad_tecnico_codigo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_cad_tecnico_codigo_seq OWNER TO postgres;

--
-- Name: tb_cad_tecnico_codigo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_cad_tecnico_codigo_seq OWNED BY public.tb_cad_tecnico.codigo;


--
-- Name: tb_cad_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_cad_usuario (
    codigo integer NOT NULL,
    usuario character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    data_input timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    codigo_empresa bigint
);


ALTER TABLE public.tb_cad_usuario OWNER TO postgres;

--
-- Name: tb_cad_usuario_codigo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_cad_usuario_codigo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_cad_usuario_codigo_seq OWNER TO postgres;

--
-- Name: tb_cad_usuario_codigo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_cad_usuario_codigo_seq OWNED BY public.tb_cad_usuario.codigo;


--
-- Name: tb_info_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_info_empresa (
    codigo integer DEFAULT nextval('public.tb_cad_usuario_codigo_seq'::regclass) NOT NULL,
    razao_social character varying(255) NOT NULL,
    nome_fantasia character varying(255) NOT NULL,
    documento character varying(255) NOT NULL
);


ALTER TABLE public.tb_info_empresa OWNER TO postgres;

--
-- Name: tb_manutencao_agendamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_agendamento (
    codigo integer NOT NULL,
    codigo_empresa integer NOT NULL,
    data_input date,
    data_agendada timestamp without time zone,
    codigo_tipo_manutencao integer,
    codigo_parceiro_negocio integer,
    descricao character varying,
    observacao character varying
);


ALTER TABLE public.tb_manutencao_agendamento OWNER TO postgres;

--
-- Name: tb_manutencao_necessidade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_necessidade (
    codigo bigint NOT NULL,
    codigo_empresa integer NOT NULL,
    solicitante character varying,
    aprovador character varying,
    descricao text,
    observacao text,
    codigo_parceiro_negocio integer,
    nome_contato character varying,
    metodo_contato character varying,
    data_input date,
    data_ultima_alteracao date,
    codigo_usuario_ultima_alteracao integer,
    codigo_stc_tipo_manutencao integer,
    codigo_stc_nivel_prioridade integer,
    desconto_bruto_geral numeric,
    acrescimo_bruto_geral numeric,
    codigo_stc_status_nm integer
);


ALTER TABLE public.tb_manutencao_necessidade OWNER TO postgres;

--
-- Name: tb_manutencao_necessidade_ativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_necessidade_ativo (
    codigo bigint NOT NULL,
    codigo_necessidade_manutencao bigint NOT NULL,
    codigo_empresa integer NOT NULL,
    codigo_ativo bigint,
    descricao text,
    observacao text
);


ALTER TABLE public.tb_manutencao_necessidade_ativo OWNER TO postgres;

--
-- Name: tb_manutencao_necessidade_ativo_imagem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_necessidade_ativo_imagem (
    codigo bigint NOT NULL,
    codigo_ativo_vinculado bigint NOT NULL,
    codigo_necessidade_manutencao bigint NOT NULL,
    codigo_empresa integer NOT NULL,
    titulo character varying,
    caminho_completo character varying,
    data_input date
);


ALTER TABLE public.tb_manutencao_necessidade_ativo_imagem OWNER TO postgres;

--
-- Name: tb_manutencao_necessidade_ativo_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_necessidade_ativo_item (
    codigo bigint NOT NULL,
    codigo_ativo_vinculado bigint NOT NULL,
    codigo_necessidade_manutencao bigint NOT NULL,
    codigo_empresa integer NOT NULL,
    codigo_item_estoque bigint,
    custo_base numeric,
    quantidade numeric,
    valor_unitario numeric
);


ALTER TABLE public.tb_manutencao_necessidade_ativo_item OWNER TO postgres;

--
-- Name: tb_manutencao_necessidade_checklist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_necessidade_checklist (
    codigo bigint NOT NULL,
    codigo_nm bigint NOT NULL,
    codigo_empresa integer NOT NULL,
    is_completa boolean,
    titulo_checklist character varying,
    observacao_checklist text
);


ALTER TABLE public.tb_manutencao_necessidade_checklist OWNER TO postgres;

--
-- Name: tb_manutencao_necessidade_checklist_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_necessidade_checklist_item (
    codigo integer NOT NULL,
    codigo_checklist bigint NOT NULL,
    codigo_nm bigint,
    codigo_empresa integer NOT NULL,
    titulo character varying,
    descricao text,
    is_atendido boolean
);


ALTER TABLE public.tb_manutencao_necessidade_checklist_item OWNER TO postgres;

--
-- Name: tb_manutencao_ordem_servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_ordem_servico (
    codigo integer NOT NULL,
    codigo_empresa integer NOT NULL,
    codigo_parceiro_negocio integer,
    observacao character varying,
    data_criacao date,
    data_ultima_alteracao date,
    codigo_usuario_ultima_alteracao bigint,
    codigo_tecnico integer,
    status integer,
    codigo_tipo_manutencao integer
);


ALTER TABLE public.tb_manutencao_ordem_servico OWNER TO postgres;

--
-- Name: tb_manutencao_ordem_servico_ativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_ordem_servico_ativo (
    codigo integer NOT NULL,
    codigo_ativo integer,
    codigo_empresa integer NOT NULL,
    codigo_os bigint NOT NULL
);


ALTER TABLE public.tb_manutencao_ordem_servico_ativo OWNER TO postgres;

--
-- Name: tb_manutencao_ordem_servico_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_ordem_servico_item (
    codigo integer NOT NULL,
    codigo_empresa integer NOT NULL,
    codigo_ordem_servico integer NOT NULL,
    codigo_item integer,
    quantidade double precision,
    valor_unitario double precision,
    data_ultima_alteracao date,
    codigo_usuario_ultima_alteracao bigint,
    codigo_ativo_vinculado integer
);


ALTER TABLE public.tb_manutencao_ordem_servico_item OWNER TO postgres;

--
-- Name: tb_manutencao_ordem_servico_tecnico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_manutencao_ordem_servico_tecnico (
    codigo_os bigint NOT NULL,
    codigo_tecnico integer NOT NULL,
    codigo_empresa integer NOT NULL
);


ALTER TABLE public.tb_manutencao_ordem_servico_tecnico OWNER TO postgres;

--
-- Name: tb_stc_nivel_prioridade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_stc_nivel_prioridade (
    codigo integer NOT NULL,
    nivel character varying(255) NOT NULL
);


ALTER TABLE public.tb_stc_nivel_prioridade OWNER TO postgres;

--
-- Name: tb_stc_nivel_prioridade_codigo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_stc_nivel_prioridade_codigo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_stc_nivel_prioridade_codigo_seq OWNER TO postgres;

--
-- Name: tb_stc_nivel_prioridade_codigo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_stc_nivel_prioridade_codigo_seq OWNED BY public.tb_stc_nivel_prioridade.codigo;


--
-- Name: tb_stc_status_nm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_stc_status_nm (
    codigo integer,
    descricao character varying
);


ALTER TABLE public.tb_stc_status_nm OWNER TO postgres;

--
-- Name: tb_stc_tipo_manutencao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_stc_tipo_manutencao (
    codigo integer,
    descricao character varying,
    ativo boolean
);


ALTER TABLE public.tb_stc_tipo_manutencao OWNER TO postgres;

--
-- Name: tb_ambientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_ambientes ALTER COLUMN id SET DEFAULT nextval('public.tb_ambientes_id_seq'::regclass);


--
-- Name: tb_cad_item codigo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_item ALTER COLUMN codigo SET DEFAULT nextval('public.tb_cad_item_codigo_seq'::regclass);


--
-- Name: tb_cad_parceiro_negocio codigo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_parceiro_negocio ALTER COLUMN codigo SET DEFAULT nextval('public.tb_cad_parceiro_negocio_id_seq'::regclass);


--
-- Name: tb_cad_tecnico codigo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_tecnico ALTER COLUMN codigo SET DEFAULT nextval('public.tb_cad_tecnico_codigo_seq'::regclass);


--
-- Name: tb_cad_usuario codigo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_usuario ALTER COLUMN codigo SET DEFAULT nextval('public.tb_cad_usuario_codigo_seq'::regclass);


--
-- Name: tb_stc_nivel_prioridade codigo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_stc_nivel_prioridade ALTER COLUMN codigo SET DEFAULT nextval('public.tb_stc_nivel_prioridade_codigo_seq'::regclass);


--
-- Name: tb_cad_ativo_foto pk_tb_cad_ativo_foto; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_ativo_foto
    ADD CONSTRAINT pk_tb_cad_ativo_foto PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_info_empresa pk_tb_info_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_info_empresa
    ADD CONSTRAINT pk_tb_info_empresa PRIMARY KEY (codigo);


--
-- Name: tb_agendamento_ativo tb_agendamento_ativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_agendamento_ativo
    ADD CONSTRAINT tb_agendamento_ativo_pkey PRIMARY KEY (codigo, codigo_empresa, codigo_agendamento);


--
-- Name: tb_ambientes tb_ambientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_ambientes
    ADD CONSTRAINT tb_ambientes_pkey PRIMARY KEY (id);


--
-- Name: tb_cad_ativo tb_cad_ativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_ativo
    ADD CONSTRAINT tb_cad_ativo_pkey PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_cad_item tb_cad_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_item
    ADD CONSTRAINT tb_cad_item_pkey PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_cad_parceiro_negocio tb_cad_parceiro_negocio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_parceiro_negocio
    ADD CONSTRAINT tb_cad_parceiro_negocio_pkey PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_cad_tecnico tb_cad_tecnico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_tecnico
    ADD CONSTRAINT tb_cad_tecnico_pkey PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_cad_usuario tb_cad_usuario_email_empresa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_usuario
    ADD CONSTRAINT tb_cad_usuario_email_empresa_key UNIQUE (email, codigo_empresa);


--
-- Name: tb_cad_usuario tb_cad_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_usuario
    ADD CONSTRAINT tb_cad_usuario_pkey PRIMARY KEY (codigo);


--
-- Name: tb_manutencao_agendamento tb_manutencao_agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_agendamento
    ADD CONSTRAINT tb_manutencao_agendamento_pkey PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_ativo_imagem tb_manutencao_necessidade_ativo_imagem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_ativo_imagem
    ADD CONSTRAINT tb_manutencao_necessidade_ativo_imagem_pkey PRIMARY KEY (codigo, codigo_ativo_vinculado, codigo_necessidade_manutencao, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_ativo_item tb_manutencao_necessidade_ativo_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_ativo_item
    ADD CONSTRAINT tb_manutencao_necessidade_ativo_item_pkey PRIMARY KEY (codigo, codigo_ativo_vinculado, codigo_necessidade_manutencao, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_ativo tb_manutencao_necessidade_ativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_ativo
    ADD CONSTRAINT tb_manutencao_necessidade_ativo_pkey PRIMARY KEY (codigo, codigo_necessidade_manutencao, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_checklist_item tb_manutencao_necessidade_checklist_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_checklist_item
    ADD CONSTRAINT tb_manutencao_necessidade_checklist_item_pkey PRIMARY KEY (codigo, codigo_checklist, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_checklist tb_manutencao_necessidade_checklist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_checklist
    ADD CONSTRAINT tb_manutencao_necessidade_checklist_pkey PRIMARY KEY (codigo, codigo_nm, codigo_empresa);


--
-- Name: tb_manutencao_necessidade tb_manutencao_necessidade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade
    ADD CONSTRAINT tb_manutencao_necessidade_pkey PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_manutencao_ordem_servico_ativo tb_manutencao_ordem_servico_ativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_ordem_servico_ativo
    ADD CONSTRAINT tb_manutencao_ordem_servico_ativo_pkey PRIMARY KEY (codigo, codigo_empresa, codigo_os);


--
-- Name: tb_manutencao_ordem_servico_item tb_manutencao_ordem_servico_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_ordem_servico_item
    ADD CONSTRAINT tb_manutencao_ordem_servico_item_pkey PRIMARY KEY (codigo, codigo_empresa, codigo_ordem_servico);


--
-- Name: tb_manutencao_ordem_servico tb_manutencao_ordem_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_ordem_servico
    ADD CONSTRAINT tb_manutencao_ordem_servico_pkey PRIMARY KEY (codigo, codigo_empresa);


--
-- Name: tb_manutencao_ordem_servico_tecnico tb_manutencao_ordem_servico_tecnico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_ordem_servico_tecnico
    ADD CONSTRAINT tb_manutencao_ordem_servico_tecnico_pkey PRIMARY KEY (codigo_os, codigo_tecnico, codigo_empresa);


--
-- Name: tb_stc_nivel_prioridade tb_stc_nivel_prioridade_nivel_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_stc_nivel_prioridade
    ADD CONSTRAINT tb_stc_nivel_prioridade_nivel_key UNIQUE (nivel);


--
-- Name: tb_stc_nivel_prioridade tb_stc_nivel_prioridade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_stc_nivel_prioridade
    ADD CONSTRAINT tb_stc_nivel_prioridade_pkey PRIMARY KEY (codigo);


--
-- Name: idx_documento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_documento ON public.tb_cad_parceiro_negocio USING btree (documento);


--
-- Name: tb_cad_ativo_foto fk_codigo_ativo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_ativo_foto
    ADD CONSTRAINT fk_codigo_ativo FOREIGN KEY (codigo_ativo, codigo_empresa) REFERENCES public.tb_cad_ativo(codigo, codigo_empresa) ON DELETE CASCADE;


--
-- Name: tb_manutencao_ordem_servico_item fk_constraint_os_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_ordem_servico_item
    ADD CONSTRAINT fk_constraint_os_item FOREIGN KEY (codigo_empresa, codigo_ordem_servico) REFERENCES public.tb_manutencao_ordem_servico(codigo_empresa, codigo) ON DELETE CASCADE;


--
-- Name: tb_manutencao_necessidade_checklist fk_manutencao_checklist; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_checklist
    ADD CONSTRAINT fk_manutencao_checklist FOREIGN KEY (codigo_nm, codigo_empresa) REFERENCES public.tb_manutencao_necessidade(codigo, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_checklist_item fk_manutencao_checklist_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_checklist_item
    ADD CONSTRAINT fk_manutencao_checklist_item FOREIGN KEY (codigo_checklist, codigo_nm, codigo_empresa) REFERENCES public.tb_manutencao_necessidade_checklist(codigo, codigo_nm, codigo_empresa);


--
-- Name: tb_cad_ativo fk_tb_cad_ativo_main_tb_stc_nivel_prioridade; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_ativo
    ADD CONSTRAINT fk_tb_cad_ativo_main_tb_stc_nivel_prioridade FOREIGN KEY (codigo_prioridade) REFERENCES public.tb_stc_nivel_prioridade(codigo);


--
-- Name: tb_agendamento_ativo tb_agendamento_ativo_codigo_agendamento_codigo_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_agendamento_ativo
    ADD CONSTRAINT tb_agendamento_ativo_codigo_agendamento_codigo_empresa_fkey FOREIGN KEY (codigo_agendamento, codigo_empresa) REFERENCES public.tb_manutencao_agendamento(codigo, codigo_empresa);


--
-- Name: tb_cad_item tb_cad_item_codigo_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_item
    ADD CONSTRAINT tb_cad_item_codigo_empresa_fkey FOREIGN KEY (codigo_empresa) REFERENCES public.tb_info_empresa(codigo);


--
-- Name: tb_manutencao_necessidade_ativo_item tb_manutencao_necessidade_at_codigo_ativo_vinculado_codig_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_ativo_item
    ADD CONSTRAINT tb_manutencao_necessidade_at_codigo_ativo_vinculado_codig_fkey1 FOREIGN KEY (codigo_ativo_vinculado, codigo_necessidade_manutencao, codigo_empresa) REFERENCES public.tb_manutencao_necessidade_ativo(codigo, codigo_necessidade_manutencao, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_ativo_imagem tb_manutencao_necessidade_ati_codigo_ativo_vinculado_codig_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_ativo_imagem
    ADD CONSTRAINT tb_manutencao_necessidade_ati_codigo_ativo_vinculado_codig_fkey FOREIGN KEY (codigo_ativo_vinculado, codigo_necessidade_manutencao, codigo_empresa) REFERENCES public.tb_manutencao_necessidade_ativo(codigo, codigo_necessidade_manutencao, codigo_empresa);


--
-- Name: tb_manutencao_necessidade_ativo tb_manutencao_necessidade_ati_codigo_necessidade_manutenca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_necessidade_ativo
    ADD CONSTRAINT tb_manutencao_necessidade_ati_codigo_necessidade_manutenca_fkey FOREIGN KEY (codigo_necessidade_manutencao, codigo_empresa) REFERENCES public.tb_manutencao_necessidade(codigo, codigo_empresa);


--
-- Name: tb_manutencao_ordem_servico_ativo tb_manutencao_ordem_servico_ativo_codigo_os_codigo_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_ordem_servico_ativo
    ADD CONSTRAINT tb_manutencao_ordem_servico_ativo_codigo_os_codigo_empresa_fkey FOREIGN KEY (codigo_os, codigo_empresa) REFERENCES public.tb_manutencao_ordem_servico(codigo, codigo_empresa);


--
-- Name: tb_manutencao_ordem_servico_tecnico tb_manutencao_ordem_servico_tecni_codigo_os_codigo_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_manutencao_ordem_servico_tecnico
    ADD CONSTRAINT tb_manutencao_ordem_servico_tecni_codigo_os_codigo_empresa_fkey FOREIGN KEY (codigo_os, codigo_empresa) REFERENCES public.tb_manutencao_ordem_servico(codigo, codigo_empresa);


--
-- PostgreSQL database dump complete
--

