CREATE TABLE IF NOT EXISTS public.tb_cad_ativo_foto (
    codigo            INTEGER NOT NULL, -- Código único para cada foto dentro da empresa
    codigo_empresa    INTEGER NOT NULL, -- Código da empresa ao qual a foto pertence
    titulo            VARCHAR(255) NOT NULL, -- Título ou nome descritivo da foto
    caminho_completo  VARCHAR(500) NOT NULL, -- Caminho completo do arquivo no servidor, incluindo extensão
    data_upload       TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora do upload da imagem
    descricao         VARCHAR(255), -- Descrição opcional da imagem
    CONSTRAINT pk_tb_cad_ativo_foto PRIMARY KEY (codigo, codigo_empresa), -- Chave primária composta
    CONSTRAINT fk_codigo_ativo FOREIGN KEY (codigo, codigo_empresa) 
        REFERENCES public.tb_cad_ativo (codigo, codigo_empresa)
        ON DELETE CASCADE -- Se o ativo ou empresa for deletado, as fotos associadas também serão deletadas
);
