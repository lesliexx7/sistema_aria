-- Crear tabla reporteFinal para almacenar los reportes completos
CREATE TABLE IF NOT EXISTS reporteFinal (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER NOT NULL,
    numero_ot VARCHAR(50) NOT NULL,
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Información del evento
    fecha_deteccion TIMESTAMP WITH TIME ZONE,
    linea_metro VARCHAR(50),
    via_afectada VARCHAR(100),
    ubicacion_fallo VARCHAR(200),
    punto_kilometrico VARCHAR(50),
    coordenadas_lat DOUBLE PRECISION,
    coordenadas_lng DOUBLE PRECISION,
    
    -- Información del activo
    tipo_sensor VARCHAR(100),
    id_activo VARCHAR(100),
    mensaje_alarma TEXT,
    sintoma_operacional TEXT,
    severidad VARCHAR(50),
    
    -- Información del técnico
    tecnico_nombre VARCHAR(200),
    tecnico_id VARCHAR(50),
    tecnico_especialidad VARCHAR(100),
    hora_llegada TIMESTAMP WITH TIME ZONE,
    
    -- Diagnóstico y acciones
    diagnostico_preliminar TEXT,
    acciones_intervencion TEXT,
    componente_reemplazado VARCHAR(200),
    componente_nuevo_id VARCHAR(100),
    
    -- Pruebas realizadas
    pruebas_realizadas TEXT[],
    notas_pruebas TEXT,
    
    -- Impacto operacional
    impacto_minutos INTEGER,
    trenes_afectados INTEGER,
    
    -- Observaciones
    observaciones TEXT,
    recomendaciones TEXT,
    
    -- Evidencia
    fotos_adjuntas INTEGER DEFAULT 0,
    
    -- Tiempos
    tiempo_total_atencion_segundos INTEGER,
    tiempo_total_atencion_formato VARCHAR(20),
    
    -- Reporte completo en texto
    reporte_texto TEXT,
    
    -- Relación con tabla evento
    FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_reporteFinal_evento_id ON reporteFinal(evento_id);
CREATE INDEX IF NOT EXISTS idx_reporteFinal_numero_ot ON reporteFinal(numero_ot);
CREATE INDEX IF NOT EXISTS idx_reporteFinal_fecha_generacion ON reporteFinal(fecha_generacion);
CREATE INDEX IF NOT EXISTS idx_reporteFinal_severidad ON reporteFinal(severidad);
CREATE INDEX IF NOT EXISTS idx_reporteFinal_linea_metro ON reporteFinal(linea_metro);

-- Verificar la estructura
\d reporteFinal
