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
-- Name: fn_select_parceiro_negocio_grid(character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_select_parceiro_negocio_grid(p_nome_fantasia character varying DEFAULT NULL::character varying, p_razao_social character varying DEFAULT NULL::character varying, p_cnpj_cpf character varying DEFAULT NULL::character varying) RETURNS TABLE(codigo integer, nome_fantasia character varying, razao_social character varying, cnpj_cpf character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tb_cad_parceiro_negocio.codigo, 
        tb_cad_parceiro_negocio.nome_fantasia, 
        tb_cad_parceiro_negocio.razao_social, 
        tb_cad_parceiro_negocio.cnpj_cpf
    FROM tb_cad_parceiro_negocio
    WHERE
        (p_nome_fantasia IS NULL OR tb_cad_parceiro_negocio.nome_fantasia ILIKE '%' || p_nome_fantasia || '%') AND
        (p_razao_social IS NULL OR tb_cad_parceiro_negocio.razao_social ILIKE '%' || p_razao_social || '%') AND
        (p_cnpj_cpf IS NULL OR tb_cad_parceiro_negocio.cnpj_cpf ILIKE '%' || p_cnpj_cpf || '%');
END;
$$;


ALTER FUNCTION public.fn_select_parceiro_negocio_grid(p_nome_fantasia character varying, p_razao_social character varying, p_cnpj_cpf character varying) OWNER TO postgres;

--
-- Name: sp_inserir_usuario(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_inserir_usuario(IN p_usuario character varying, IN p_senha character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO usuarios (usuario, senha) VALUES (p_usuario, p_senha);
END;
$$;


ALTER PROCEDURE public.sp_inserir_usuario(IN p_usuario character varying, IN p_senha character varying) OWNER TO postgres;

--
-- Name: sp_verificar_login(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_verificar_login(IN p_usuario character varying, IN p_senha character varying, OUT login_valido boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    SELECT COUNT(*) > 0 INTO login_valido FROM usuarios WHERE usuario = p_usuario AND senha = p_senha;
END;
$$;


ALTER PROCEDURE public.sp_verificar_login(IN p_usuario character varying, IN p_senha character varying, OUT login_valido boolean) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tb_cad_parceiro_negocio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_cad_parceiro_negocio (
    codigo integer NOT NULL,
    nome_fantasia character varying(255) NOT NULL,
    razao_social character varying(255) NOT NULL,
    cnpj_cpf character varying(20) NOT NULL,
    data_cadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tb_cad_parceiro_negocio OWNER TO postgres;

--
-- Name: tb_cad_parceiro_negocio_codigo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_cad_parceiro_negocio_codigo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_cad_parceiro_negocio_codigo_seq OWNER TO postgres;

--
-- Name: tb_cad_parceiro_negocio_codigo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_cad_parceiro_negocio_codigo_seq OWNED BY public.tb_cad_parceiro_negocio.codigo;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario character varying(100) NOT NULL,
    senha character varying(255) NOT NULL,
    data_cadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: tb_cad_parceiro_negocio codigo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_parceiro_negocio ALTER COLUMN codigo SET DEFAULT nextval('public.tb_cad_parceiro_negocio_codigo_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: tb_cad_parceiro_negocio tb_cad_parceiro_negocio_cnpj_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_parceiro_negocio
    ADD CONSTRAINT tb_cad_parceiro_negocio_cnpj_cpf_key UNIQUE (cnpj_cpf);


--
-- Name: tb_cad_parceiro_negocio tb_cad_parceiro_negocio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_cad_parceiro_negocio
    ADD CONSTRAINT tb_cad_parceiro_negocio_pkey PRIMARY KEY (codigo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- PostgreSQL database dump complete
--

