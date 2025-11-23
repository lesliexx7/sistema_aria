# 🚇 Sistema ARIA - Integración Completa con Base de Datos

## ✅ Sistema Unificado - Base de Datos Real

### 📊 Tablas de la Base de Datos

#### 1. Tabla `evento`
Almacena los eventos/incidencias detectadas por los sensores.

**Columnas:**
- `id` - ID del ticket (PRIMARY KEY)
- `timestamp` - Fecha/hora de detección del fallo
- `id_sensor` - ID del sensor que detectó el fallo (ej: L5_S015)
- `severidad` - Nivel de severidad (bajo, medio, alto, crítico)
- `estampa_asignacion` - Timestamp cuando el técnico toma el caso
- `estampa_finalizacion` - Timestamp cuando se finaliza el caso
- `tiempo_atencion_minutos` - Tiempo total de atención en minutos

#### 2. Tabla `sensores`
Contiene todos los sensores del Metro CDMX con sus ubicaciones GPS.

**Columnas:**
- `id` - ID interno
- `sensor_id` - ID del sensor (ej: L5_S015)
- `linea` - Línea del metro
- `lat` - Latitud GPS
- `lon` - Longitud GPS
- `posicion_en_linea` - Posición en la línea
- `fecha_registro` - Fecha de registro

#### 3. Tabla `reportefinal`
Almacena los reportes completos generados por los técnicos.

**Columnas principales:**
- `id` - ID del reporte
- `evento_id` - Relación con la tabla evento
- `numero_ot` - Número de orden de trabajo
- `fecha_generacion` - Fecha de generación del reporte
- `severidad` - Severidad del fallo
- `tecnico_nombre` - Nombre del técnico
- `diagnostico_preliminar` - Diagnóstico
- `acciones_intervencion` - Acciones realizadas
- `tiempo_total_atencion_segundos` - Tiempo total en segundos
- `tiempo_total_atencion_formato` - Tiempo en formato HH:MM:SS
- `reporte_texto` - Reporte completo en texto
- ... (32 columnas en total)

## 🔄 Flujo Completo del Sistema

### 1. Detección de Fallo
```
Sensor detecta anomalía
    ↓
Se crea registro en tabla `evento`
    - id (auto-generado)
    - timestamp (NOW())
    - id_sensor (ej: L5_S015)
    - severidad (NULL)
    - estampa_asignacion (NULL)
    - estampa_finalizacion (NULL)
```

### 2. Sistema ARIA Carga Eventos
```
Frontend consulta: GET /api/eventos/pendientes
    ↓
Backend ejecuta query:
    SELECT * FROM evento 
    WHERE estampa_finalizacion IS NULL
    ↓
Backend busca datos del sensor:
    SELECT * FROM sensores 
    WHERE sensor_id = 'L5_S015'
    ↓
Backend devuelve evento enriquecido:
    - ticketId
    - timestamp
    - sensorId
    - linea
    - lat, lng (coordenadas GPS)
    - severidad
```

### 3. Usuario Toma el Caso
```
Usuario selecciona ticket en la interfaz
    ↓
Timer empieza automáticamente
    ↓
Sistema asigna técnico más cercano (calculado en frontend)
```

### 4. Usuario Selecciona Severidad
```
Usuario selecciona en el formulario:
    - Bajo
    - Medio
    - Alto
    - Crítico
```

### 5. Técnico en Camino
```
Usuario cambia estado a "En Camino"
    ↓
Frontend: PATCH /api/eventos/:id/estado
    Body: { estado: "en-route" }
    ↓
Backend ejecuta:
    UPDATE evento 
    SET estampa_asignacion = NOW() 
    WHERE id = :id
    ↓
Se guarda timestamp de asignación
```

### 6. Trabajo en Sitio
```
Usuario cambia estados:
    - En Sitio
    - Reparando
    ↓
Usuario completa formulario:
    - Síntoma operacional
    - Diagnóstico preliminar
    - Acciones de intervención
    - Componente reemplazado
    - Pruebas realizadas
    - Observaciones
    - Recomendaciones
```

### 7. Generar Reporte
```
Usuario presiona "Generar Reporte"
    ↓
Sistema valida:
    ✓ Severidad seleccionada
    ↓
Se genera reporte en formato texto
```

### 8. Finalizar Caso
```
Usuario presiona "Finalizar y Enviar Reporte"
    ↓
Frontend calcula tiempo total
    ↓
Frontend: PATCH /api/eventos/:id/finalizar
    Body: {
        tiempoAtencionMinutos: 15,
        severidad: "alto"
    }
    ↓
Backend ejecuta:
    UPDATE evento 
    SET estampa_finalizacion = NOW(),
        tiempo_atencion_minutos = 15,
        severidad = 'alto'
    WHERE id = :id
    ↓
Frontend: POST /api/reportes
    Body: { ...todos los datos del reporte... }
    ↓
Backend ejecuta:
    INSERT INTO reportefinal (
        evento_id, numero_ot, severidad,
        tecnico_nombre, diagnostico_preliminar,
        acciones_intervencion, tiempo_total_atencion_segundos,
        reporte_texto, ...
    ) VALUES (...)
    ↓
Evento desaparece de "Eventos Pendientes"
    (porque tiene estampa_finalizacion)
```

## 🎯 Endpoints de la API

### GET /api/eventos/pendientes
Obtiene eventos sin finalizar con datos del sensor.

**Query SQL:**
```sql
SELECT e.id, e.timestamp, e.id_sensor, e.severidad
FROM evento e
WHERE e.estampa_finalizacion IS NULL
ORDER BY e.timestamp DESC
```

**Respuesta:**
```json
[
  {
    "ticketId": 85,
    "timestamp": "2025-11-23T06:45:21Z",
    "sensorId": "L5_S015",
    "linea": "5",
    "lat": 19.46094,
    "lng": -99.1257,
    "severidad": null
  }
]
```

### PATCH /api/eventos/:id/estado
Actualiza el estado del evento (guarda estampa_asignacion).

**Body:**
```json
{
  "estado": "en-route"
}
```

**Query SQL:**
```sql
UPDATE evento 
SET estampa_asignacion = NOW() 
WHERE id = 85
```

### PATCH /api/eventos/:id/finalizar
Finaliza el evento (guarda estampa_finalizacion y tiempo).

**Body:**
```json
{
  "tiempoAtencionMinutos": 15,
  "severidad": "alto"
}
```

**Query SQL:**
```sql
UPDATE evento 
SET estampa_finalizacion = NOW(),
    tiempo_atencion_minutos = 15,
    severidad = 'alto'
WHERE id = 85
```

### POST /api/reportes
Guarda el reporte completo en la tabla reportefinal.

**Body:**
```json
{
  "eventoId": 85,
  "numeroOT": "OT-85",
  "severidad": "alto",
  "tecnicoNombre": "Juan Pérez",
  "diagnosticoPreliminar": "Fallo en comunicación",
  "accionesIntervencion": "Reemplazo de módulo",
  "tiempoTotalSegundos": 900,
  "tiempoTotalFormato": "00:15:00",
  "reporteTexto": "REPORTE COMPLETO..."
}
```

## 📈 Datos Almacenados

### En tabla `evento`:
- ✅ ID del ticket
- ✅ Timestamp de detección
- ✅ ID del sensor
- ✅ Severidad
- ✅ Timestamp de asignación
- ✅ Timestamp de finalización
- ✅ Tiempo de atención en minutos

### En tabla `reportefinal`:
- ✅ Toda la información del evento
- ✅ Datos del técnico
- ✅ Diagnóstico completo
- ✅ Acciones realizadas
- ✅ Componentes reemplazados
- ✅ Pruebas realizadas
- ✅ Observaciones y recomendaciones
- ✅ Tiempo total de atención
- ✅ Reporte completo en texto

## 🔍 Consultas Útiles

### Ver eventos pendientes:
```sql
SELECT id, timestamp, id_sensor, severidad, estampa_asignacion
FROM evento
WHERE estampa_finalizacion IS NULL
ORDER BY timestamp DESC;
```

### Ver eventos finalizados:
```sql
SELECT id, timestamp, id_sensor, severidad, 
       estampa_asignacion, estampa_finalizacion,
       tiempo_atencion_minutos
FROM evento
WHERE estampa_finalizacion IS NOT NULL
ORDER BY estampa_finalizacion DESC;
```

### Ver reportes generados:
```sql
SELECT id, evento_id, numero_ot, severidad,
       tecnico_nombre, tiempo_total_atencion_formato,
       fecha_generacion
FROM reportefinal
ORDER BY fecha_generacion DESC;
```

### Ver reporte completo:
```sql
SELECT reporte_texto
FROM reportefinal
WHERE id = 1;
```

### Calcular tiempo promedio de atención:
```sql
SELECT AVG(tiempo_atencion_minutos) as promedio_minutos
FROM evento
WHERE estampa_finalizacion IS NOT NULL;
```

### Eventos por severidad:
```sql
SELECT severidad, COUNT(*) as total
FROM evento
WHERE severidad IS NOT NULL
GROUP BY severidad
ORDER BY total DESC;
```

## ✅ Sistema Completamente Funcional

El sistema ahora está **100% integrado con la base de datos real**:

1. ✅ Lee eventos reales de la tabla `evento`
2. ✅ Obtiene datos de sensores de la tabla `sensores`
3. ✅ Guarda timestamps de asignación y finalización
4. ✅ Guarda tiempo de atención
5. ✅ Guarda severidad
6. ✅ Guarda reportes completos en `reportefinal`
7. ✅ Los eventos finalizados desaparecen de pendientes
8. ✅ Todo persiste en la base de datos PostgreSQL

**No hay simulaciones, todo es real.** 🎉
