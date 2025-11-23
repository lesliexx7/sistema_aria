# ✅ Checklist de Verificación - Sistema ARIA

## 📋 Antes de Iniciar

### Archivos del Backend
- [x] `server/server.js` - Servidor Express
- [x] `server/db.js` - Conexión PostgreSQL
- [x] `server/.env` - Variables de entorno
- [x] `server/package.json` - Dependencias
- [x] `server/test-db.js` - Script de prueba

### Archivos del Frontend
- [x] `api.js` - Servicio de API
- [x] `ARIAApp.jsx` - Modificado con integración

### Documentación
- [x] `INSTRUCCIONES_INTEGRACION.md`
- [x] `ARQUITECTURA.md`
- [x] `RESUMEN_IMPLEMENTACION.md`
- [x] `server/README.md`
- [x] `server/EJEMPLOS_API.md`

## 🔧 Pasos de Verificación

### 1. Verificar Estructura de Archivos
```bash
# Verificar que existan los archivos del servidor
dir server

# Verificar que exista el servicio de API
dir src\services
```

**Resultado esperado:**
```
✅ server/server.js
✅ server/db.js
✅ server/.env
✅ server/package.json
✅ server/test-db.js
✅ api.js
```

### 2. Instalar Dependencias del Servidor
```bash
cd server
npm install
```

**Resultado esperado:**
```
✅ express instalado
✅ pg instalado
✅ cors instalado
✅ dotenv instalado
```

### 3. Probar Conexión a Base de Datos
```bash
cd server
npm run test-db
```

**Resultado esperado:**
```
✅ Conectado a PostgreSQL
✅ Tabla eventos encontrada
✅ Eventos pendientes: X
✅ Eventos de ejemplo mostrados
```

**Si falla:**
- [ ] Verificar credenciales en `.env`
- [ ] Verificar que la base de datos esté accesible
- [ ] Verificar que la tabla `eventos` exista

### 4. Iniciar Servidor Backend
```bash
cd server
npm run dev
```

**Resultado esperado:**
```
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en http://localhost:3001
```

**Si falla:**
- [ ] Puerto 3001 ya está en uso (cerrar otros procesos)
- [ ] Error de conexión a DB (verificar credenciales)

### 5. Probar Endpoint de Health
En otra terminal:
```bash
curl http://localhost:3001/health
```

**Resultado esperado:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-23T..."
}
```

### 6. Probar Endpoint de Eventos
```bash
curl http://localhost:3001/api/eventos/pendientes
```

**Resultado esperado:**
```json
[
  {
    "ticketId": 123,
    "timestamp": "...",
    "sensorId": "L1_S001",
    "linea": 1,
    "lat": 19.39955,
    "lng": -99.1959
  }
]
```

**Si devuelve array vacío `[]`:**
- [ ] No hay eventos con estado 'pendiente' en la DB
- [ ] Insertar eventos de prueba en la tabla

**Si devuelve error:**
- [ ] Verificar logs del servidor
- [ ] Verificar que la tabla `eventos` tenga las columnas correctas

### 7. Iniciar Frontend
En otra terminal:
```bash
npm run dev
```

**Resultado esperado:**
```
✅ Servidor de desarrollo iniciado
✅ http://localhost:5173
```

### 8. Verificar Interfaz Web
Abrir navegador en `http://localhost:5173`

**Verificar:**
- [ ] Pantalla de login aparece
- [ ] Seleccionar "Centro de Control"
- [ ] Sistema ARIA carga correctamente
- [ ] Barra de eventos pendientes aparece (si hay eventos)
- [ ] Mapa de Google Maps carga
- [ ] No hay errores en la consola del navegador

### 9. Verificar Carga de Eventos
En la consola del navegador (F12):

**Buscar:**
```
✅ Sin errores de CORS
✅ Sin errores de fetch
✅ Requests a http://localhost:3001/api/eventos/pendientes
```

**Si hay errores:**
- [ ] Verificar que el servidor backend esté corriendo
- [ ] Verificar CORS en el servidor
- [ ] Verificar URL de la API en `src/services/api.js`

### 10. Probar Selección de Ticket
Si hay eventos pendientes:

**Pasos:**
1. [ ] Click en un ticket de la barra naranja
2. [ ] Verificar que se cargue el evento
3. [ ] Verificar que se asigne un técnico
4. [ ] Verificar coordenadas en el mapa

**Resultado esperado:**
```
✅ Evento cargado con datos correctos
✅ Técnico asignado automáticamente
✅ Mapa muestra ubicación del fallo
✅ Información del sensor correcta
```

### 11. Probar Actualización de Estado
**Pasos:**
1. [ ] Cambiar estado a "En Camino"
2. [ ] Verificar en logs del servidor que se recibió el PATCH
3. [ ] Verificar en la base de datos que el estado cambió

**En el servidor debe aparecer:**
```
PATCH /api/eventos/123/estado 200 12ms
```

**Verificar en DB:**
```sql
SELECT id, estado FROM eventos WHERE id = 123;
```

**Resultado esperado:**
```
✅ Estado actualizado en DB
✅ Sin errores en el servidor
✅ Sin errores en el frontend
```

### 12. Probar Flujo Completo
**Pasos:**
1. [ ] Seleccionar evento pendiente
2. [ ] Cambiar a "En Camino"
3. [ ] Cambiar a "En Sitio"
4. [ ] Cambiar a "Reparando"
5. [ ] Llenar formulario de reporte
6. [ ] Cambiar a "Resuelto"

**Resultado esperado:**
```
✅ Todos los cambios de estado funcionan
✅ Formulario se habilita en "Reparando"
✅ Modal de éxito aparece al resolver
✅ Estados se actualizan en DB
```

## 🐛 Problemas Comunes

### Error: ECONNREFUSED
**Causa:** El servidor backend no está corriendo

**Solución:**
```bash
cd server
npm run dev
```

### Error: CORS
**Causa:** Problema de configuración de CORS

**Solución:**
- Verificar que `cors` esté instalado
- Verificar que `app.use(cors())` esté en `server.js`

### Error: Sensor no encontrado
**Causa:** El IDSensor no está en el mapeo

**Solución:**
- Agregar el sensor a `SENSOR_MAP` en `server/server.js`
- Formato: `'L1_S001': { linea: 1, lat: 19.xxxxx, lng: -99.xxxxx }`

### No aparecen eventos
**Causa:** No hay eventos con estado 'pendiente'

**Solución:**
```sql
-- Insertar evento de prueba
INSERT INTO eventos (timestamp, "IDSensor", estado)
VALUES (NOW(), 'L1_S001', 'pendiente');
```

### Error de conexión a PostgreSQL
**Causa:** Credenciales incorrectas o DB no accesible

**Solución:**
- Verificar credenciales en `server/.env`
- Verificar que la IP sea accesible
- Verificar firewall

## ✅ Checklist Final

### Backend
- [ ] Servidor corriendo en puerto 3001
- [ ] Conexión a PostgreSQL exitosa
- [ ] Endpoint `/health` responde
- [ ] Endpoint `/api/eventos/pendientes` responde
- [ ] Sin errores en logs

### Frontend
- [ ] Servidor corriendo en puerto 5173
- [ ] Login funciona
- [ ] Sistema ARIA carga
- [ ] Eventos pendientes aparecen (si existen)
- [ ] Mapa de Google Maps carga
- [ ] Sin errores en consola

### Integración
- [ ] Frontend se conecta al backend
- [ ] Eventos se cargan correctamente
- [ ] Técnicos se asignan automáticamente
- [ ] Estados se actualizan en DB
- [ ] Flujo completo funciona

### Documentación
- [ ] Leído `INSTRUCCIONES_INTEGRACION.md`
- [ ] Revisado `ARQUITECTURA.md`
- [ ] Consultado `RESUMEN_IMPLEMENTACION.md`

## 🎉 Sistema Verificado

Si todos los checks están marcados, el sistema está funcionando correctamente.

**¡Felicidades! El sistema ARIA está integrado con la base de datos. 🚀**

---

## 📞 Siguiente Paso

Si todo funciona correctamente, puedes:
1. Agregar más sensores al mapeo
2. Insertar eventos reales en la base de datos
3. Capacitar a los usuarios
4. Monitorear el sistema en producción

Si algo no funciona, revisar la sección "Problemas Comunes" o consultar los archivos de documentación.
