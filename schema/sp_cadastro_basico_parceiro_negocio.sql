-- PROCEDURE: public.sp_cadastro_basico_parceiro_negocio(character varying, boolean, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, integer)

-- DROP PROCEDURE IF EXISTS public.sp_cadastro_basico_parceiro_negocio(character varying, boolean, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, integer);

CREATE OR REPLACE PROCEDURE public.sp_cadastro_basico_parceiro_negocio(
	IN nome_razao_social character varying,
	IN is_cnpj boolean,
	IN documento character varying,
	IN endereco character varying,
	IN cidade character varying,
	IN estado character varying,
	IN cep character varying,
	IN telefone character varying,
	IN email character varying,
	IN tipo_parceiro character varying,
	IN p_codigo_empresa integer)
LANGUAGE 'plpgsql'
AS $BODY$
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
$BODY$;
ALTER PROCEDURE public.sp_cadastro_basico_parceiro_negocio(character varying, boolean, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, integer)
    OWNER TO postgres;
