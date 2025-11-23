# Arquitectura del Sistema ARIA

##  Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS PostgreSQL                  │
│                    (34.69.252.59:5432)                       │
│                                                               │
│  Tabla: eventos                                               │
│  ├─ id (ticket)                                              │
│  ├─ timestamp (fecha/hora detección)                         │
│  ├─ IDSensor (ej: L1_S001)                                   │
│  └─ estado (pendiente/en-camino/resuelto)                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ PostgreSQL Connection (SSL)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    BACKEND (Node.js + Express)               │
│                    Puerto: 3001                              │
│                                                               │
│  Endpoints:                                                   │
│  ├─ GET  /api/eventos/pendientes                            │
│  │   └─ Extrae: id, timestamp, IDSensor                     │
│  │   └─ Enriquece con: linea, lat, lng                      │
│  │                                                            │
│  └─ PATCH /api/eventos/:id/estado                           │
│      └─ Actualiza estado del evento                          │
│                                                               │
│  Servicios:                                                   │
│  ├─ Mapeo de 50+ sensores con GPS                           │
│  ├─ Cálculo de técnico más cercano                          │
│  └─ Validación de datos                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ REST API (JSON)
                        │ CORS habilitado
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│                    Puerto: 5173                              │
│                                                               │
│  Componentes Principales:                                     │
│  ├─ ARIAApp.jsx                                              │
│  │   ├─ Gestión de fallos                                   │
│  │   ├─ Lista de eventos pendientes                         │
│  │   ├─ Mapa de Google Maps                                 │
│  │   └─ Flujo de estados                                     │
│  │                                                            │
│  ├─ Dashboard.jsx                                            │
│  │   └─ Estadísticas y análisis                             │
│  │                                                            │
│  ├─ TechnicianView.jsx                                       │
│  │   └─ Vista para técnicos de campo                        │
│  │                                                            │
│  └─ LoginScreen.jsx                                          │
│      └─ Selección de usuario                                 │
│                                                               │
│  Servicios:                                                   │
│  ├─ api.js (comunicación con backend)                       │
│  ├─ sensorsData.js (mapeo de sensores)                      │
│  └─ technicianData.js (datos de técnicos)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Google Maps API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    GOOGLE MAPS API                           │
│                                                               │
│  Servicios utilizados:                                        │
│  ├─ Maps JavaScript API                                      │
│  ├─ Directions API (rutas optimizadas)                      │
│  ├─ Traffic Layer (tráfico en tiempo real)                  │
│  └─ Geometry Library (cálculos de distancia)                │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### 1. Detección de Fallo
```
Sensor detecta fallo
    ↓
Se crea registro en tabla eventos
    ↓
estado = 'pendiente'
```

### 2. Carga en Sistema ARIA
```
Frontend consulta: GET /api/eventos/pendientes
    ↓
Backend extrae de DB: id, timestamp, IDSensor
    ↓
Backend enriquece con:
    - Línea del metro (desde IDSensor)
    - Coordenadas GPS (desde mapeo)
    ↓
Frontend recibe evento completo
    ↓
Se muestra en lista de pendientes
```

### 3. Asignación de Técnico
```
Usuario selecciona evento
    ↓
Sistema calcula técnico más cercano:
    - 8 técnicos disponibles
    - Ubicación GPS de cada uno
    - Distancia al fallo
    - Tiempo estimado
    ↓
Se asigna automáticamente
```

### 4. Actualización de Estado
```
Técnico cambia estado (ej: "En Camino")
    ↓
Frontend: PATCH /api/eventos/:id/estado
    ↓
Backend actualiza en DB
    ↓
estado = 'en-camino'
```

### 5. Resolución
```
Técnico completa reparación
    ↓
Genera reporte con:
    - Diagnóstico
    - Acciones realizadas
    - Componentes reemplazados
    - Pruebas realizadas
    ↓
Estado = 'resuelto'
    ↓
Se guarda en historial
```

## 🗂️ Estructura de Archivos

```
proyecto/
├── server/                      # Backend
│   ├── server.js               # Servidor Express
│   ├── db.js                   # Conexión PostgreSQL
│   ├── .env                    # Variables de entorno
│   ├── package.json            # Dependencias
│   ├── test-db.js              # Script de prueba
│   └── README.md               # Documentación
│
├── src/                        # Frontend
│   ├── ARIAApp.jsx            # Componente principal
│   ├── Dashboard.jsx          # Dashboard de estadísticas
│   ├── TechnicianView.jsx     # Vista de técnico
│   ├── LoginScreen.jsx        # Pantalla de login
│   ├── App.jsx                # App principal
│   ├── sensorsData.js         # Datos de sensores
│   ├── technicianData.js      # Datos de técnicos
│   └── services/
│       └── api.js             # Servicio de API
│
├── INSTRUCCIONES_INTEGRACION.md
├── ARQUITECTURA.md
└── iniciar-sistema.bat
```

## Seguridad

### Backend
-  Variables de entorno para credenciales
-  Conexión SSL a PostgreSQL
-  CORS configurado
- Validación de datos de entrada
-  Manejo de errores

### Frontend
-  API key de Google Maps en código (para desarrollo)
-  En producción: mover a variable de entorno
-  Validación de formularios
-  Flujo secuencial de estados

##  Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **pg** - Cliente de PostgreSQL
- **cors** - Middleware de CORS
- **dotenv** - Variables de entorno

### Frontend
- **React** - Librería de UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **Google Maps API** - Mapas y navegación

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **Tabla eventos** - Almacenamiento de incidencias

## 🚀 Escalabilidad

### Actual
-  50+ sensores mapeados
-  8 técnicos disponibles
-  Actualización cada 30 segundos
-  Soporte multi-usuario

### Futuro
-  Agregar más sensores al mapeo
-  Aumentar número de técnicos
-  WebSockets para actualizaciones en tiempo real
-  Notificaciones push
-  Historial completo en base de datos
-  Reportes PDF automáticos
