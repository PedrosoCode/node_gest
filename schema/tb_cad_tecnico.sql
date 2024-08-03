CREATE TABLE tb_cad_tecnico (
    codigo SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

INSERT INTO tb_cad_tecnico (nome) VALUES ('teste');
