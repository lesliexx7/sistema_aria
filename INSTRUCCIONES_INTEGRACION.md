# Instrucciones de Integración - Sistema ARIA con Base de Datos

## ✅ Cambios Implementados

### 1. Backend (Servidor Node.js + Express)
Se creó un servidor backend que:
- Se conecta a la base de datos PostgreSQL
- Extrae eventos de la tabla `eventos` con: `id`, `timestamp`, `IDSensor`
- Obtiene automáticamente la línea y coordenadas GPS desde el `IDSensor`
- Asigna técnicos activos más cercanos al fallo
- Actualiza el estado de los eventos en tiempo real

**Archivos creados:**
- `server/server.js` - Servidor Express con endpoints
- `server/db.js` - Configuración de PostgreSQL
- `server/.env` - Variables de entorno (ya configurado)
- `server/package.json` - Dependencias del servidor
- `server/test-db.js` - Script de prueba de conexión

### 2. Frontend (React)
Se modificó el sistema ARIA para:
- Conectarse automáticamente al backend
- Cargar eventos pendientes cada 30 segundos
- Mostrar lista de tickets pendientes en la interfaz
- Permitir seleccionar tickets para trabajar
- Actualizar estados en el backend automáticamente

**Archivos modificados:**
- `ARIAApp.jsx` - Integración con API del backend
- `api.js` - Servicio de comunicación con backend (nuevo)

## 🚀 Pasos para Iniciar el Sistema

### Paso 1: Probar la conexión a la base de datos
```bash
cd server
npm install
npm run test-db
```

Esto verificará:
- ✅ Conexión a PostgreSQL
- ✅ Existencia de la tabla `eventos`
- ✅ Cantidad de eventos pendientes
- ✅ Muestra de eventos de ejemplo

### Paso 2: Iniciar el servidor backend
```bash
cd server
npm run dev
```

El servidor estará en: `http://localhost:3001`

### Paso 3: Iniciar el frontend
En otra terminal:
```bash
npm run dev
```

El frontend estará en: `http://localhost:5173`

## 📊 Flujo de Datos

```
Base de Datos (PostgreSQL)
    ↓
    eventos (id, timestamp, IDSensor, estado)
    ↓
Backend (Node.js)
    ↓
    GET /api/eventos/pendientes
    ↓
    Enriquece con:
    - Línea del metro (desde IDSensor)
    - Coordenadas GPS (desde mapeo de sensores)
    - Técnico más cercano (cálculo automático)
    ↓
Frontend (React)
    ↓
    Muestra en interfaz ARIA
    ↓
    Usuario actualiza estado
    ↓
    PATCH /api/eventos/:id/estado
    ↓
Base de Datos actualizada
```

## 🔧 Endpoints del Backend

### GET /api/eventos/pendientes
Obtiene eventos pendientes con toda la información necesaria.

**Respuesta:**
```json
[
  {
    "ticketId": 123,
    "timestamp": "2025-11-23T10:30:00Z",
    "sensorId": "L1_S001",
    "linea": 1,
    "lat": 19.39955,
    "lng": -99.1959
  }
]
```

### PATCH /api/eventos/:id/estado
Actualiza el estado de un evento.

**Body:**
```json
{
  "estado": "en-camino"
}
```

**Estados válidos:**
- `pendiente`
- `en-camino`
- `en-sitio`
- `reparando`
- `resuelto`

## 🎯 Características Implementadas

### En el Frontend:
1. ✅ Carga automática de eventos desde la base de datos
2. ✅ Lista visual de tickets pendientes (máximo 5 visibles)
3. ✅ Selección de ticket para trabajar
4. ✅ Actualización automática cada 30 segundos
5. ✅ Asignación automática del técnico más cercano
6. ✅ Sincronización de estados con el backend

### En el Backend:
1. ✅ Conexión a PostgreSQL con SSL
2. ✅ Extracción de datos de la tabla `eventos`
3. ✅ Mapeo de sensores con coordenadas GPS reales
4. ✅ Enriquecimiento automático de datos
5. ✅ Actualización de estados en la base de datos
6. ✅ Manejo de errores y logs

## 📝 Notas Importantes

### Mapeo de Sensores
El sistema incluye un mapeo de 50+ sensores del Metro CDMX con coordenadas GPS reales. Si un sensor no está en el mapeo, se registrará un warning en la consola pero no detendrá el sistema.

### Estados del Sistema
Los estados en el backend usan guiones (`en-camino`) mientras que en el frontend usan guiones bajos (`EN_ROUTE`). La conversión se hace automáticamente.

### Asignación de Técnicos
El sistema calcula automáticamente el técnico más cercano usando:
- Coordenadas GPS del fallo
- Ubicación actual de los 8 técnicos disponibles
- Cálculo de distancia en línea recta
- Tiempo estimado de llegada

### Persistencia
Los datos se guardan en:
- **Base de datos**: Estados de eventos y tickets
- **LocalStorage**: Historial y estadísticas del dashboard

## 🐛 Solución de Problemas

### Error de conexión al backend
- Verificar que el servidor esté corriendo en puerto 3001
- Revisar la consola del servidor para errores
- Verificar que las credenciales de la base de datos sean correctas

### No aparecen eventos
- Ejecutar `npm run test-db` para verificar la conexión
- Verificar que existan eventos con `estado = 'pendiente'` en la tabla
- Revisar la consola del navegador para errores de CORS

### Sensor no encontrado
- Verificar que el `IDSensor` en la base de datos coincida con el formato del mapeo
- Formato esperado: `L1_S001`, `L2_S010`, `LA_S001`, etc.
- Agregar nuevos sensores al archivo `server/server.js` en el objeto `SENSOR_MAP`

## 📞 Soporte

Para agregar más sensores al mapeo, editar el objeto `SENSOR_MAP` en `server/server.js` con el formato:
```javascript
'L1_S001': { linea: 1, lat: 19.39955, lng: -99.1959 }
```
