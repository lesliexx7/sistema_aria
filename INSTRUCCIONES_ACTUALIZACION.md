# 🚀 INSTRUCCIONES DE ACTUALIZACIÓN - Sistema ARIA

## ✅ Cambios Implementados

### 1. **Técnicos Reales desde Base de Datos**
- ✅ Tabla `tecnicos` creada en PostgreSQL
- ✅ 8 técnicos con ubicaciones reales en CDMX
- ✅ Sistema de disponibilidad (ocupado/disponible)

### 2. **Distancias y Tiempos Reales con Google Maps**
- ✅ Integración con Google Distance Matrix API
- ✅ Cálculo de distancias reales considerando tráfico en tiempo real
- ✅ Tiempos estimados precisos con condiciones de tráfico actuales

### 3. **Selección de Técnico Mejorada**
- ✅ Modal que muestra múltiples técnicos cercanos ordenados por distancia
- ✅ Técnico más cercano marcado como "RECOMENDADO"
- ✅ Información detallada: distancia, tiempo con tráfico, experiencia, especialidad

### 4. **Sincronización de Tiempos**
- ✅ Timer inicia cuando se asigna técnico (no antes)
- ✅ `estampa_asignacion` se guarda al asignar técnico
- ✅ Técnico se libera automáticamente al finalizar evento

## 📋 Pasos para Actualizar el Sistema

### Paso 1: Instalar Dependencias del Servidor
```bash
cd server
npm install
```

### Paso 2: Crear Tabla de Técnicos
```bash
node crear-tabla-tecnicos.js
```

**Salida esperada:**
```
📋 Creando tabla de técnicos...
✅ Tabla tecnicos creada e inicializada exitosamente
📊 Total de técnicos: 8
```

### Paso 3: Verificar Estructura Completa
```bash
node verificar-tablas-completas.js
```

**Debe mostrar:**
- ✓ Tabla sensores: OK
- ✓ Tabla evento: OK (con columna tiempo_atencion_minutos)
- ✓ Tabla tecnicos: OK
- ✓ Tabla reporteFinal: OK

### Paso 4: Iniciar el Sistema

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🔄 Flujo Actualizado del Sistema

### 1. **Seleccionar Evento Pendiente**
- Usuario hace clic en un ticket pendiente
- Sistema busca técnicos disponibles usando Google Distance Matrix API
- Se muestra modal con técnicos ordenados por distancia

### 2. **Asignar Técnico**
- Usuario selecciona técnico (recomendado: el más cercano)
- Se guarda `estampa_asignacion` en la base de datos
- Técnico se marca como "ocupado"
- Timer inicia automáticamente

### 3. **Cambiar Estado a "En Camino"**
- Estado cambia a "En Camino"
- Mapa muestra ruta con tráfico en tiempo real
- Distancia y tiempo se actualizan con datos reales

### 4. **Completar Reporte**
- Técnico llena formulario con severidad (obligatorio)
- Se genera reporte completo
- Al finalizar:
  - Se guarda `estampa_finalizacion`
  - Se guarda `tiempo_atencion_minutos`
  - Se guarda `severidad`
  - Técnico se libera automáticamente (disponible = true)

## 🗄️ Estructura de Base de Datos

### Tabla: `tecnicos`
```sql
- id (VARCHAR) - ID único del técnico
- nombre (VARCHAR) - Nombre completo
- especialidad (VARCHAR) - Área de especialización
- lat (DECIMAL) - Latitud de ubicación actual
- lon (DECIMAL) - Longitud de ubicación actual
- disponible (BOOLEAN) - true = disponible, false = ocupado
- experiencia (INTEGER) - Años de experiencia
- telefono (VARCHAR) - Número de contacto
- fecha_actualizacion (TIMESTAMP) - Última actualización
```

### Tabla: `evento` (actualizada)
```sql
- id (INTEGER) - ID único del evento
- timestamp (TIMESTAMP) - Fecha/hora de detección
- id_sensor (VARCHAR) - ID del sensor que generó el evento
- severidad (VARCHAR) - Nivel de severidad (critico, alto, medio, bajo)
- estampa_asignacion (TIMESTAMP) - Cuando se asigna técnico
- estampa_finalizacion (TIMESTAMP) - Cuando se finaliza
- tiempo_atencion_minutos (INTEGER) - Tiempo total de atención
```

## 🔑 API de Google Maps

**API Key configurada:** `AIzaSyC7NXQukGGQtFCZaSNz_KbYL5PD68825oo`

**APIs habilitadas necesarias:**
- ✅ Distance Matrix API
- ✅ Maps JavaScript API
- ✅ Directions API

## 📊 Endpoints Nuevos del Backend

### `POST /api/tecnicos/cercanos`
Obtiene técnicos disponibles con distancias y tiempos reales.

**Request:**
```json
{
  "lat": 19.4326,
  "lng": -99.1332
}
```

**Response:**
```json
[
  {
    "id": "TEC-2847",
    "nombre": "Carlos Mendoza García",
    "especialidad": "Señalización y Control",
    "experiencia": 8,
    "distancia": "5.2 km",
    "distanciaMetros": 5200,
    "tiempoEstimado": "15 min",
    "tiempoConTrafico": "23 min",
    "tiempoConTraficoSegundos": 1380,
    "ubicacion": { "lat": 19.4326, "lng": -99.1332 }
  }
]
```

### `PATCH /api/eventos/:id/asignar-tecnico`
Asigna técnico a un evento y marca estampa_asignacion.

**Request:**
```json
{
  "tecnicoId": "TEC-2847"
}
```

### `PATCH /api/tecnicos/:id/liberar`
Libera técnico (marca como disponible).

## ✅ Verificación Final

1. **Backend corriendo:** http://localhost:3002/health
2. **Frontend corriendo:** http://localhost:5173
3. **Eventos pendientes cargados:** Deben aparecer en la barra amarilla
4. **Al seleccionar evento:** Debe mostrar modal con técnicos
5. **Al asignar técnico:** Timer debe iniciar
6. **Al finalizar:** Técnico debe quedar disponible nuevamente

## 🐛 Solución de Problemas

### Error: "Tabla tecnicos no existe"
```bash
cd server
node crear-tabla-tecnicos.js
```

### Error: "Cannot find module 'node-fetch'"
```bash
cd server
npm install
```

### Error: "Google API error"
- Verificar que la API key esté activa
- Verificar que Distance Matrix API esté habilitada en Google Cloud Console

### Técnicos no aparecen
```bash
cd server
node crear-tabla-tecnicos.js
```

## 📝 Notas Importantes

- **Timer:** Ahora inicia cuando se asigna técnico, no al seleccionar evento
- **Severidad:** Es obligatoria antes de generar reporte
- **Técnicos:** Se liberan automáticamente al finalizar evento
- **Distancias:** Son reales y consideran tráfico actual
- **Tiempos:** Se actualizan en tiempo real con condiciones de tráfico

---

**Sistema actualizado y listo para producción** ✅
