# ARIA Backend - Sistema de Gestión de Incidencias Metro CDMX

## Configuración

### 1. Instalar dependencias
```bash
cd server
npm install
```

### 2. Configurar variables de entorno
El archivo `.env` ya está configurado con la base de datos PostgreSQL.

### 3. Iniciar el servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## Endpoints

### GET /api/eventos/pendientes
Obtiene todos los eventos pendientes con información del sensor.

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

### GET /health
Verifica el estado del servidor.

## Integración con Frontend

El frontend se conecta automáticamente al backend y:
1. Carga eventos pendientes cada 30 segundos
2. Muestra una lista de tickets pendientes
3. Permite seleccionar un ticket para trabajar en él
4. Actualiza el estado del ticket en tiempo real
5. Asigna automáticamente el técnico más cercano

## Estructura de la Base de Datos

### Tabla: eventos
- `id` - ID del ticket
- `timestamp` - Fecha y hora de detección
- `IDSensor` - ID del sensor que generó el evento
- `estado` - Estado actual del evento

El sistema obtiene automáticamente:
- Línea del metro (desde el ID del sensor)
- Coordenadas GPS (desde el mapeo de sensores)
- Técnico más cercano (calculado en tiempo real)

### Tabla: tecnicos
- `id` - ID del técnico (ej: TEC-2847)
- `nombre` - Nombre completo
- `especialidad` - Área de especialización
- `lat`, `lon` - Ubicación GPS actual
- `disponible` - Estado de disponibilidad
- `experiencia` - Años de experiencia
- `telefono` - Número de contacto

## Gestión de Técnicos

### Scripts Disponibles

#### Verificar y Corregir Estado
```bash
node verificar-y-corregir-tecnicos.js
```
Verifica el estado de los técnicos y corrige problemas automáticamente.

#### Simulación Rápida
```bash
node simular-tecnicos.js
```
Pone todos los técnicos disponibles y los distribuye estratégicamente.

#### Simulador Interactivo
```bash
node simular-escenarios.js
```
Menú interactivo con múltiples escenarios:
1. Todos disponibles (8 técnicos)
2. Turno reducido (4 técnicos)
3. Emergencia (2 técnicos)
4. Posicionar cerca de sensor
5. Distribución aleatoria
6. Ver estado actual
7. Liberar todos

#### Probar Asignación
```bash
node probar-asignacion.js
```
Prueba el flujo completo de asignación de técnicos.

#### Diagnóstico Completo
```bash
node diagnostico-completo.js
```
Verifica todo el sistema y genera un reporte completo.

### Endpoints de Técnicos

#### POST /api/tecnicos/cercanos
Busca técnicos cercanos a una ubicación.

**Body:**
```json
{
  "lat": 19.4326,
  "lng": -99.1332
}
```

**Respuesta:**
```json
[
  {
    "id": "TEC-2847",
    "nombre": "Carlos Mendoza García",
    "especialidad": "Señalización y Control",
    "experiencia": 8,
    "distancia": "2.5 km",
    "tiempoEstimado": "8 mins",
    "tiempoConTrafico": "12 mins"
  }
]
```

#### PATCH /api/eventos/:id/asignar-tecnico
Asigna un técnico a un evento.

**Body:**
```json
{
  "tecnicoId": "TEC-2847"
}
```

#### PATCH /api/tecnicos/:id/liberar
Libera un técnico ocupado.

### Solución Rápida de Problemas

#### "No hay técnicos disponibles"
```bash
node verificar-y-corregir-tecnicos.js
```

#### "Tabla tecnicos no existe"
```bash
node crear-tabla-tecnicos.js
```

### Documentación Adicional

Ver archivos en la raíz del proyecto:
- `INSTRUCCIONES_SIMULACION_TECNICOS.md` - Guía completa
- `GUIA_RAPIDA_TECNICOS.md` - Referencia rápida
- `SOLUCION_TECNICOS.md` - Solución implementada
