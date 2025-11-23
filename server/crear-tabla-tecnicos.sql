-- Crear tabla de técnicos
CREATE TABLE IF NOT EXISTS tecnicos (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    especialidad VARCHAR(200) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lon DECIMAL(11, 8) NOT NULL,
    disponible BOOLEAN DEFAULT true,
    experiencia INTEGER DEFAULT 0,
    telefono VARCHAR(20),
    fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Insertar técnicos con ubicaciones reales en CDMX
INSERT INTO tecnicos (id, nombre, especialidad, lat, lon, disponible, experiencia, telefono) VALUES
('TEC-2847', 'Carlos Mendoza García', 'Señalización y Control', 19.4326, -99.1332, true, 8, '5512345678'),
('TEC-3921', 'María Elena Rodríguez', 'Sistemas Eléctricos', 19.4969, -99.1271, true, 12, '5523456789'),
('TEC-1456', 'José Luis Hernández', 'Contadores de Ejes', 19.3629, -99.1454, true, 6, '5534567890'),
('TEC-5783', 'Ana Patricia Gómez', 'Comunicaciones', 19.4284, -99.2077, true, 10, '5545678901'),
('TEC-4129', 'Roberto Sánchez Pérez', 'Mantenimiento General', 19.4326, -99.0721, true, 15, '5556789012'),
('TEC-6847', 'Laura Martínez Cruz', 'Señalización y Control', 19.3907, -99.1759, true, 7, '5567890123'),
('TEC-2134', 'Miguel Ángel Torres', 'Sistemas Eléctricos', 19.4845, -99.1947, true, 9, '5578901234'),
('TEC-8956', 'Diana Flores Ramírez', 'Contadores de Ejes', 19.3567, -99.0856, true, 5, '5589012345')
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    especialidad = EXCLUDED.especialidad,
    lat = EXCLUDED.lat,
    lon = EXCLUDED.lon,
    disponible = EXCLUDED.disponible,
    experiencia = EXCLUDED.experiencia,
    telefono = EXCLUDED.telefono,
    fecha_actualizacion = NOW();

-- Verificar datos insertados
SELECT * FROM tecnicos ORDER BY id;
