CREATE OR REPLACE PROCEDURE public.sp_insert_cadastro_basico_ativo(
    IN p_codigo_cliente integer,
    IN p_numero_serie character varying,
    IN p_codigo_fabricante integer,
    IN p_modelo character varying,
    IN p_codigo_prioridade smallint,
    IN p_codigo_tecnico_responsavel integer,
    IN p_observacao character varying,
    IN p_nivel_manutencao boolean,
    IN p_codigo_empresa integer)
LANGUAGE 'plpgsql'
AS $BODY$
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
$BODY$;
