-- Agregar columna estampa_finalizacion a la tabla evento
ALTER TABLE evento 
ADD COLUMN IF NOT EXISTS estampa_finalizacion TIMESTAMP WITH TIME ZONE;

-- Verificar la estructura actualizada
\d evento
