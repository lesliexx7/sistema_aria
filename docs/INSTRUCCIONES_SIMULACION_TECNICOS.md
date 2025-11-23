# 🔧 Simulación de Técnicos - Sistema ARIA

## Problema Detectado

El sistema muestra "no hay técnicos disponibles" porque los técnicos en la base de datos están marcados como `disponible = false` o no están posicionados correctamente.

## Solución Rápida

### Opción 1: Usar el archivo batch (Recomendado para Windows)

```bash
simular-tecnicos.bat
```

Selecciona la opción 1 para verificar y corregir automáticamente.

### Opción 2: Ejecutar scripts manualmente

#### 1. Verificar y Corregir Estado Actual

```bash
cd server
node verificar-y-corregir-tecnicos.js
```

Este script:
- ✅ Verifica si existen técnicos en la BD
- ✅ Detecta técnicos no disponibles
- ✅ Libera automáticamente todos los técnicos
- ✅ Muestra el estado actual del sistema

#### 2. Simulación Rápida (Todos Disponibles)

```bash
cd server
node simular-tecnicos.js
```

Este script:
- ✅ Pone todos los técnicos disponibles
- ✅ Los distribuye estratégicamente en CDMX
- ✅ Actualiza sus ubicaciones cerca de líneas del metro

#### 3. Simulador Interactivo (Múltiples Escenarios)

```bash
cd server
node simular-escenarios.js
```

Escenarios disponibles:

1. **🟢 Todos disponibles** - Cobertura completa (8 técnicos)
2. **🟡 Turno reducido** - Solo 50% disponibles (4 técnicos)
3. **🔴 Emergencia** - Solo 2 técnicos más experimentados
4. **📍 Cerca de sensor** - Posicionar técnicos cerca de un incidente específico
5. **🎲 Aleatorio** - Distribución y disponibilidad aleatoria
6. **📊 Ver estado** - Consultar estado actual sin cambios
7. **🔄 Liberar todos** - Marcar todos como disponibles

## Cómo Probar el Sistema

### Paso 1: Preparar Técnicos

```bash
# Opción A: Corrección automática
cd server
node verificar-y-corregir-tecnicos.js

# Opción B: Simulación completa
cd server
node simular-tecnicos.js
```

### Paso 2: Iniciar el Sistema

```bash
# Terminal 1: Iniciar servidor
cd server
npm start

# Terminal 2: Iniciar frontend
npm run dev
```

### Paso 3: Probar Asignación

1. Abre el dashboard en el navegador
2. Verifica que haya eventos pendientes
3. Haz clic en "Asignar Técnico"
4. Deberías ver la lista de técnicos disponibles con:
   - Distancia real (usando Google Maps API)
   - Tiempo estimado con tráfico
   - Especialidad y experiencia

## Escenarios de Prueba Recomendados

### Escenario 1: Operación Normal

```bash
node simular-escenarios.js
# Seleccionar opción 1 (Todos disponibles)
```

**Resultado esperado:** 
- 8 técnicos disponibles
- Asignación exitosa al técnico más cercano
- Tiempos de respuesta óptimos

### Escenario 2: Turno Nocturno

```bash
node simular-escenarios.js
# Seleccionar opción 2 (Turno reducido)
```

**Resultado esperado:**
- 4 técnicos disponibles
- Tiempos de respuesta más largos
- Sistema debe asignar al más cercano disponible

### Escenario 3: Situación Crítica

```bash
node simular-escenarios.js
# Seleccionar opción 3 (Emergencia)
```

**Resultado esperado:**
- Solo 2 técnicos (los más experimentados)
- Tiempos de respuesta muy largos
- Priorización por experiencia

### Escenario 4: Incidente Específico

```bash
node simular-escenarios.js
# Seleccionar opción 4 (Cerca de sensor)
# Elegir ubicación del incidente
```

**Resultado esperado:**
- Técnicos posicionados cerca del incidente
- Tiempos de respuesta mínimos (< 10 min)
- Asignación inmediata

## Verificación del Sistema

### Verificar Técnicos en Base de Datos

```sql
-- Conectar a PostgreSQL
psql -U postgres -d aria_db

-- Ver todos los técnicos
SELECT id, nombre, especialidad, disponible, lat, lon 
FROM tecnicos 
ORDER BY disponible DESC;

-- Contar disponibles
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN disponible THEN 1 ELSE 0 END) as disponibles
FROM tecnicos;
```

### Verificar Endpoint de API

```bash
# Probar endpoint de técnicos cercanos
curl -X POST http://localhost:3002/api/tecnicos/cercanos \
  -H "Content-Type: application/json" \
  -d "{\"lat\": 19.4326, \"lng\": -99.1332}"
```

**Respuesta esperada:**
```json
[
  {
    "id": "TEC-2847",
    "nombre": "Carlos Mendoza García",
    "especialidad": "Señalización y Control",
    "distancia": "2.5 km",
    "tiempoEstimado": "8 mins",
    "tiempoConTrafico": "12 mins"
  }
]
```

## Solución de Problemas

### Problema: "No hay técnicos en la base de datos"

**Solución:**
```bash
cd server
node crear-tabla-tecnicos.js
```

### Problema: "Todos los técnicos están ocupados"

**Solución:**
```bash
cd server
node verificar-y-corregir-tecnicos.js
```

O manualmente en PostgreSQL:
```sql
UPDATE tecnicos SET disponible = true;
```

### Problema: "Error al calcular distancias"

**Causa:** API Key de Google Maps inválida o límite excedido

**Solución:**
1. Verificar API Key en `server/.env`
2. Verificar cuota en Google Cloud Console
3. Usar simulación sin API (distancia euclidiana)

### Problema: "Técnicos muy lejos del incidente"

**Solución:**
```bash
node simular-escenarios.js
# Opción 4: Posicionar cerca de sensor específico
```

## Monitoreo en Tiempo Real

### Ver logs del servidor

```bash
cd server
npm start
```

Buscar mensajes como:
```
🔍 Buscando técnicos cercanos a: 19.4326, -99.1332
✅ Encontrados 8 técnicos disponibles
   Más cercano: Carlos Mendoza - 2.5 km (12 mins)
```

### Ver estado de técnicos

```bash
cd server
node simular-escenarios.js
# Opción 6: Ver estado actual
```

## Automatización

### Script para resetear sistema diariamente

Crear `reset-diario.bat`:

```batch
@echo off
echo Reseteando sistema...
cd server
node verificar-y-corregir-tecnicos.js
node simular-tecnicos.js
echo Sistema listo para operar
```

### Programar en Windows Task Scheduler

1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Trigger: Diariamente a las 6:00 AM
4. Acción: Ejecutar `reset-diario.bat`

## Notas Importantes

⚠️ **Datos de Prueba:** Los técnicos actuales son datos de prueba. En producción, usar datos reales.

⚠️ **API Key:** La API Key de Google Maps tiene límites de uso. Monitorear consumo.

⚠️ **Ubicaciones:** Las coordenadas son aproximadas. Ajustar según necesidades reales.

✅ **Recomendación:** Ejecutar `verificar-y-corregir-tecnicos.js` antes de cada sesión de pruebas.

## Próximos Pasos

1. ✅ Verificar estado actual de técnicos
2. ✅ Ejecutar simulación apropiada
3. ✅ Iniciar sistema completo
4. ✅ Probar asignación de técnicos
5. ✅ Verificar tiempos de respuesta
6. ✅ Validar comportamiento del sistema

---

**Última actualización:** Noviembre 2025
