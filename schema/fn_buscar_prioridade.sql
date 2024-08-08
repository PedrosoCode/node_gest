-- FUNCTION: public.fn_buscar_prioridade()

-- DROP FUNCTION IF EXISTS public.fn_buscar_prioridade();

CREATE OR REPLACE FUNCTION public.fn_buscar_prioridade(
	)
    RETURNS TABLE(res_codigo integer, res_nivel character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
  RETURN QUERY SELECT codigo, nivel FROM tb_stc_nivel_prioridade;
END;
$BODY$;

ALTER FUNCTION public.fn_buscar_prioridade()
    OWNER TO postgres;
