# Ejemplos de Uso de la API

## 🔍 Probar la API con curl (Windows CMD)

### 1. Health Check
```cmd
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-23T10:30:00.000Z"
}
```

### 2. Obtener Eventos Pendientes
```cmd
curl http://localhost:3001/api/eventos/pendientes
```

**Respuesta esperada:**
```json
[
  {
    "ticketId": 123,
    "timestamp": "2025-11-23T10:30:00.000Z",
    "sensorId": "L1_S001",
    "linea": 1,
    "lat": 19.39955,
    "lng": -99.1959
  },
  {
    "ticketId": 124,
    "timestamp": "2025-11-23T10:35:00.000Z",
    "sensorId": "L2_S010",
    "linea": 2,
    "lat": 19.45268,
    "lng": -99.1752
  }
]
```

### 3. Actualizar Estado de Evento
```cmd
curl -X PATCH http://localhost:3001/api/eventos/123/estado ^
  -H "Content-Type: application/json" ^
  -d "{\"estado\":\"en-camino\"}"
```

**Respuesta esperada:**
```json
{
  "id": 123,
  "timestamp": "2025-11-23T10:30:00.000Z",
  "IDSensor": "L1_S001",
  "estado": "en-camino"
}
```

## 🔍 Probar la API con PowerShell

### 1. Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get
```

### 2. Obtener Eventos Pendientes
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/eventos/pendientes" -Method Get
```

### 3. Actualizar Estado de Evento
```powershell
$body = @{
    estado = "en-camino"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/eventos/123/estado" `
  -Method Patch `
  -Body $body `
  -ContentType "application/json"
```

## 🔍 Probar la API con JavaScript (Fetch)

### 1. Obtener Eventos Pendientes
```javascript
fetch('http://localhost:3001/api/eventos/pendientes')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 2. Actualizar Estado de Evento
```javascript
fetch('http://localhost:3001/api/eventos/123/estado', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    estado: 'en-camino'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## 📝 Estados Válidos

| Estado Backend | Estado Frontend | Descripción |
|---------------|-----------------|-------------|
| `pendiente` | `PENDING` | Fallo detectado, esperando asignación |
| `en-camino` | `EN_ROUTE` | Técnico en camino al sitio |
| `en-sitio` | `ON_SITE` | Técnico llegó al sitio |
| `reparando` | `WORKING` | Técnico trabajando en la reparación |
| `resuelto` | `RESOLVED` | Fallo resuelto |

## 🧪 Casos de Prueba

### Caso 1: Flujo Completo
```javascript
// 1. Obtener eventos pendientes
const eventos = await fetch('http://localhost:3001/api/eventos/pendientes')
  .then(r => r.json());

console.log(`Eventos pendientes: ${eventos.length}`);

// 2. Seleccionar primer evento
const evento = eventos[0];
console.log(`Trabajando en ticket #${evento.ticketId}`);

// 3. Actualizar a "en-camino"
await fetch(`http://localhost:3001/api/eventos/${evento.ticketId}/estado`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estado: 'en-camino' })
});

// 4. Actualizar a "en-sitio"
await fetch(`http://localhost:3001/api/eventos/${evento.ticketId}/estado`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estado: 'en-sitio' })
});

// 5. Actualizar a "reparando"
await fetch(`http://localhost:3001/api/eventos/${evento.ticketId}/estado`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estado: 'reparando' })
});

// 6. Actualizar a "resuelto"
await fetch(`http://localhost:3001/api/eventos/${evento.ticketId}/estado`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estado: 'resuelto' })
});

console.log('✅ Ticket resuelto');
```

### Caso 2: Manejo de Errores
```javascript
// Intentar actualizar evento inexistente
fetch('http://localhost:3001/api/eventos/99999/estado', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estado: 'en-camino' })
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error esperado:', error.message);
    // Error esperado: HTTP 404: Not Found
  });
```

### Caso 3: Sensor No Encontrado
```javascript
// Si un sensor no está en el mapeo, se filtra automáticamente
const eventos = await fetch('http://localhost:3001/api/eventos/pendientes')
  .then(r => r.json());

// Solo se devuelven eventos con sensores válidos
eventos.forEach(evento => {
  console.log(`✅ Sensor válido: ${evento.sensorId}`);
});
```

## 🐛 Códigos de Error

| Código | Descripción | Solución |
|--------|-------------|----------|
| 404 | Evento no encontrado | Verificar que el ID del ticket exista |
| 500 | Error del servidor | Revisar logs del servidor y conexión a DB |
| CORS | Error de CORS | Verificar que el servidor esté corriendo |
| ECONNREFUSED | No se puede conectar | Verificar que el servidor esté en puerto 3001 |

## 📊 Monitoreo

### Ver logs del servidor
```bash
cd server
npm run dev
```

Los logs mostrarán:
- ✅ Conexión a PostgreSQL
- 🚀 Servidor iniciado
- 📥 Requests recibidos
- ⚠️ Warnings (sensores no encontrados)
- ❌ Errores

### Ejemplo de logs:
```
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en http://localhost:3001
GET /api/eventos/pendientes 200 45ms
⚠️  Sensor no encontrado: L99_S999
PATCH /api/eventos/123/estado 200 12ms
```
