CREATE TABLE IF NOT EXISTS public.tb_cad_ativo
(
    codigo integer NOT NULL,
    codigo_cliente integer,
    numero_serie character varying(255) COLLATE pg_catalog."default",
    codigo_fabricante integer,
    modelo character varying COLLATE pg_catalog."default",
    codigo_prioridade smallint,
    codigo_tecnico_responsavel integer,
    observacao character varying COLLATE pg_catalog."default",
    data_input date DEFAULT CURRENT_DATE,
    nivel_manutencao boolean,
    codigo_empresa integer NOT NULL,
    CONSTRAINT tb_cad_ativo_pkey PRIMARY KEY (codigo, codigo_empresa), -- Chave primária composta
    CONSTRAINT fk_tb_cad_ativo_main_tb_stc_nivel_prioridade FOREIGN KEY (codigo_prioridade)
        REFERENCES public.tb_stc_nivel_prioridade (codigo) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE IF EXISTS public.tb_cad_ativo
    OWNER to postgres;
