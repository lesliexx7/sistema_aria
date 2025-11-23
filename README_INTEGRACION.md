# 🚇 Sistema ARIA - Integración con Base de Datos PostgreSQL

## 📋 Resumen

Sistema completo de gestión de incidencias del Metro CDMX integrado con base de datos PostgreSQL. Extrae eventos de la tabla `eventos`, los enriquece con datos de sensores y coordenadas GPS, asigna técnicos automáticamente y actualiza estados en tiempo real.

## 🎯 Funcionalidades Implementadas

✅ **Extracción de eventos** desde tabla `eventos` (id, timestamp, IDSensor)  
✅ **Enriquecimiento automático** con línea y coordenadas GPS  
✅ **Asignación de técnicos** más cercanos al fallo  
✅ **Interfaz visual** con lista de tickets pendientes  
✅ **Actualización en tiempo real** de estados en la base de datos  
✅ **Mapeo de 50+ sensores** del Metro CDMX con GPS real  

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Windows)
```cmd
iniciar-sistema.bat
```

### Opción 2: Manual

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run test-db    # Probar conexión
npm run dev        # Iniciar servidor
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📚 Documentación

### Para Empezar
- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - 3 pasos para iniciar el sistema

### Guías Completas
- **[INSTRUCCIONES_INTEGRACION.md](INSTRUCCIONES_INTEGRACION.md)** - Guía paso a paso detallada
- **[CHECKLIST_VERIFICACION.md](CHECKLIST_VERIFICACION.md)** - Lista de verificación completa

### Documentación Técnica
- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Diagrama de arquitectura y flujo de datos
- **[RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md)** - Resumen de implementación
- **[server/README.md](server/README.md)** - Documentación del backend
- **[server/EJEMPLOS_API.md](server/EJEMPLOS_API.md)** - Ejemplos de uso de la API

## 🏗️ Arquitectura

```
PostgreSQL (eventos) 
    ↓
Backend (Node.js + Express)
    ├─ Extrae: id, timestamp, IDSensor
    ├─ Enriquece: línea, lat, lng
    └─ Asigna: técnico más cercano
    ↓
Frontend (React)
    ├─ Lista de eventos pendientes
    ├─ Selección de tickets
    ├─ Mapa con Google Maps
    └─ Actualización de estados
    ↓
PostgreSQL (actualización de estados)
```

## 📡 Endpoints de la API

### GET /api/eventos/pendientes
Obtiene eventos pendientes enriquecidos con datos del sensor.

### PATCH /api/eventos/:id/estado
Actualiza el estado de un evento.

### GET /health
Verifica el estado del servidor.

## 🗺️ Mapeo de Sensores

50+ sensores del Metro CDMX incluidos:
- Línea 1: 4 sensores
- Línea 2: 5 sensores
- Línea 3: 5 sensores
- Línea 4: 3 sensores
- Línea 5: 4 sensores
- Línea 6: 3 sensores
- Línea 7: 4 sensores
- Línea 8: 4 sensores
- Línea 9: 4 sensores
- Línea A: 4 sensores
- Línea B: 5 sensores
- Línea 12: 5 sensores

## 👥 Sistema de Técnicos

8 técnicos disponibles con:
- Ubicación GPS en tiempo real
- Especialidad definida
- Cálculo automático de distancia
- Tiempo estimado de llegada

## 🔧 Tecnologías

### Backend
- Node.js + Express
- PostgreSQL (pg)
- CORS
- dotenv

### Frontend
- React + Vite
- Tailwind CSS
- Google Maps API
- Lucide Icons

## 📊 Base de Datos

### Configuración (server/.env)
```env
DB_HOST=34.69.252.59
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=metro
DB_PORT=5432
```

### Tabla: eventos
- `id` - ID del ticket
- `timestamp` - Fecha/hora de detección
- `IDSensor` - ID del sensor (ej: L1_S001)
- `estado` - Estado actual (pendiente/en-camino/resuelto)

## ✅ Verificación

### 1. Probar conexión a DB
```bash
cd server
npm run test-db
```

### 2. Verificar backend
```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/eventos/pendientes
```

### 3. Verificar frontend
Abrir http://localhost:5173 y verificar:
- ✅ Login funciona
- ✅ Barra de eventos pendientes aparece
- ✅ Mapa carga correctamente
- ✅ Cambio de estado actualiza DB

## 🐛 Solución de Problemas

### Backend no inicia
- Verificar puerto 3001 disponible
- Verificar credenciales en `.env`
- Verificar conexión a PostgreSQL

### No aparecen eventos
- Verificar que existan eventos con `estado = 'pendiente'`
- Ejecutar `npm run test-db` para diagnóstico

### Sensor no encontrado
- Agregar sensor a `SENSOR_MAP` en `server/server.js`
- Formato: `'L1_S001': { linea: 1, lat: 19.xxxxx, lng: -99.xxxxx }`

Ver más en [CHECKLIST_VERIFICACION.md](CHECKLIST_VERIFICACION.md)

## 📞 Archivos Creados

### Backend
```
server/
├── server.js           # Servidor Express
├── db.js              # Conexión PostgreSQL
├── test-db.js         # Script de prueba
├── package.json       # Dependencias
├── .env               # Variables de entorno
├── README.md          # Documentación
└── EJEMPLOS_API.md    # Ejemplos de API
```

### Frontend
```
src/
└── services/
    └── api.js         # Servicio de API
```

### Documentación
```
├── README_INTEGRACION.md          # Este archivo
├── INICIO_RAPIDO.md               # Inicio rápido
├── INSTRUCCIONES_INTEGRACION.md   # Guía completa
├── ARQUITECTURA.md                # Arquitectura
├── RESUMEN_IMPLEMENTACION.md      # Resumen
├── CHECKLIST_VERIFICACION.md      # Checklist
└── iniciar-sistema.bat            # Script de inicio
```

## 🎓 Próximos Pasos

1. Agregar más sensores al mapeo
2. Implementar WebSockets para tiempo real
3. Agregar notificaciones push
4. Guardar reportes en base de datos
5. Dashboard de administración

## 📄 Licencia

Sistema ARIA - Metro CDMX © 2025

---

**¿Listo para empezar?** Lee [INICIO_RAPIDO.md](INICIO_RAPIDO.md) para iniciar en 3 pasos.

**¿Necesitas ayuda?** Consulta [CHECKLIST_VERIFICACION.md](CHECKLIST_VERIFICACION.md) para solución de problemas.

**¿Quieres entender la arquitectura?** Lee [ARQUITECTURA.md](ARQUITECTURA.md) para ver el diagrama completo.
