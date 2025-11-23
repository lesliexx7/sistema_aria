-- Agregar columna tiempo_atencion_minutos a la tabla evento
ALTER TABLE evento 
ADD COLUMN IF NOT EXISTS tiempo_atencion_minutos INTEGER;

-- Verificar la estructura actualizada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'evento'
ORDER BY ordinal_position;
