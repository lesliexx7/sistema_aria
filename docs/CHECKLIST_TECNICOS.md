# ✅ Checklist de Verificación - Sistema de Técnicos

## 📋 Antes de Iniciar el Sistema

### 1. Base de Datos
- [ ] PostgreSQL está corriendo
- [ ] Base de datos `aria_db` existe
- [ ] Tabla `tecnicos` existe
- [ ] Tabla `sensores` existe
- [ ] Tabla `evento` existe

**Verificar:**
```bash
cd server
node diagnostico-completo.js
```

### 2. Técnicos
- [ ] Hay técnicos registrados (mínimo 1)
- [ ] Hay técnicos disponibles (mínimo 1)
- [ ] Técnicos tienen ubicaciones válidas
- [ ] Todas las especialidades están cubiertas

**Verificar:**
```bash
cd server
node verificar-y-corregir-tecnicos.js
```

### 3. Configuración
- [ ] Archivo `.env` existe en carpeta `server`
- [ ] Variables de entorno configuradas
- [ ] API Key de Google Maps (opcional)
- [ ] Puerto 3002 disponible

**Verificar:**
```bash
cd server
type .env
```

---

## 🚀 Inicio del Sistema

### 1. Preparar Técnicos
```bash
# Opción A: Menú interactivo
simular-tecnicos.bat
# Seleccionar opción 1

# Opción B: Comando directo
cd server
node verificar-y-corregir-tecnicos.js
```

- [ ] Script ejecutado sin errores
- [ ] Técnicos disponibles confirmados
- [ ] Ubicaciones actualizadas

### 2. Iniciar Servidor Backend
```bash
cd server
npm start
```

- [ ] Servidor inicia sin errores
- [ ] Puerto 3002 en uso
- [ ] Mensaje "Servidor corriendo" visible
- [ ] Conexión a PostgreSQL exitosa

### 3. Iniciar Frontend
```bash
# En nueva terminal
npm run dev
```

- [ ] Frontend inicia sin errores
- [ ] Puerto 5173 en uso
- [ ] URL local mostrada

### 4. Verificar en Navegador
```
http://localhost:5173
```

- [ ] Dashboard carga correctamente
- [ ] Eventos pendientes visibles
- [ ] Botón "Asignar Técnico" disponible

---

## 🧪 Pruebas de Funcionalidad

### 1. Asignación Básica

**Pasos:**
1. [ ] Abrir dashboard
2. [ ] Ver lista de eventos pendientes
3. [ ] Hacer clic en "Asignar Técnico"
4. [ ] Ver lista de técnicos disponibles
5. [ ] Verificar distancias y tiempos
6. [ ] Seleccionar técnico
7. [ ] Confirmar asignación

**Resultado esperado:**
- [ ] Lista de técnicos se muestra
- [ ] Distancias calculadas correctamente
- [ ] Técnico se asigna exitosamente
- [ ] Técnico desaparece de lista de disponibles

### 2. Múltiples Asignaciones

**Pasos:**
1. [ ] Asignar técnico a evento 1
2. [ ] Asignar técnico a evento 2
3. [ ] Verificar que técnicos asignados no aparezcan

**Resultado esperado:**
- [ ] Cada evento tiene técnico diferente
- [ ] Técnicos ocupados no están disponibles
- [ ] Sistema previene doble asignación

### 3. Liberación de Técnicos

**Pasos:**
1. [ ] Completar un evento
2. [ ] Enviar reporte final
3. [ ] Verificar que técnico vuelva a estar disponible

**Resultado esperado:**
- [ ] Técnico se libera automáticamente
- [ ] Aparece en búsquedas futuras
- [ ] Estado actualizado en BD

---

## 🎯 Escenarios de Prueba

### Escenario 1: Operación Normal
```bash
cd server
node simular-escenarios.js
# Opción 1: Todos disponibles
```

**Verificar:**
- [ ] 8 técnicos disponibles
- [ ] Asignación rápida (< 15 min)
- [ ] Múltiples especialidades

### Escenario 2: Turno Reducido
```bash
cd server
node simular-escenarios.js
# Opción 2: Turno reducido
```

**Verificar:**
- [ ] 4 técnicos disponibles
- [ ] Tiempos de respuesta más largos
- [ ] Sistema asigna correctamente

### Escenario 3: Emergencia
```bash
cd server
node simular-escenarios.js
# Opción 3: Emergencia
```

**Verificar:**
- [ ] Solo 2 técnicos disponibles
- [ ] Priorización por experiencia
- [ ] Sistema funciona con recursos limitados

### Escenario 4: Incidente Específico
```bash
cd server
node simular-escenarios.js
# Opción 4: Cerca de sensor
```

**Verificar:**
- [ ] Técnicos cerca del incidente
- [ ] Tiempos de respuesta mínimos
- [ ] Asignación inmediata

---

## 🔍 Verificación de API

### Endpoint: Técnicos Cercanos

**Prueba manual:**
```bash
curl -X POST http://localhost:3002/api/tecnicos/cercanos \
  -H "Content-Type: application/json" \
  -d "{\"lat\": 19.4326, \"lng\": -99.1332}"
```

**Verificar:**
- [ ] Respuesta HTTP 200
- [ ] JSON válido
- [ ] Lista de técnicos con distancias
- [ ] Tiempos estimados incluidos

### Endpoint: Asignar Técnico

**Prueba manual:**
```bash
curl -X PATCH http://localhost:3002/api/eventos/123/asignar-tecnico \
  -H "Content-Type: application/json" \
  -d "{\"tecnicoId\": \"TEC-2847\"}"
```

**Verificar:**
- [ ] Respuesta HTTP 200
- [ ] Evento actualizado
- [ ] Técnico marcado como ocupado

### Endpoint: Liberar Técnico

**Prueba manual:**
```bash
curl -X PATCH http://localhost:3002/api/tecnicos/TEC-2847/liberar
```

**Verificar:**
- [ ] Respuesta HTTP 200
- [ ] Técnico disponible nuevamente

---

## 📊 Verificación de Base de Datos

### Consultas SQL

```sql
-- Ver todos los técnicos
SELECT id, nombre, disponible, lat, lon 
FROM tecnicos 
ORDER BY disponible DESC;

-- Contar disponibles
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN disponible THEN 1 ELSE 0 END) as disponibles
FROM tecnicos;

-- Ver eventos pendientes
SELECT id, id_sensor, severidad, estampa_asignacion
FROM evento
WHERE estampa_finalizacion IS NULL;

-- Ver técnicos por especialidad
SELECT especialidad, COUNT(*) as cantidad
FROM tecnicos
WHERE disponible = true
GROUP BY especialidad;
```

**Verificar:**
- [ ] Datos consistentes
- [ ] Sin valores NULL inesperados
- [ ] Coordenadas válidas (CDMX)

---

## ⚠️ Solución de Problemas

### Problema: No hay técnicos disponibles

**Solución:**
```bash
cd server
node verificar-y-corregir-tecnicos.js
```

- [ ] Script ejecutado
- [ ] Técnicos liberados
- [ ] Problema resuelto

### Problema: Error de conexión a BD

**Verificar:**
- [ ] PostgreSQL corriendo
- [ ] Credenciales correctas en `.env`
- [ ] Base de datos existe
- [ ] Puerto 5432 disponible

**Solución:**
```bash
# Windows
net start postgresql-x64-14

# Verificar conexión
psql -U postgres -d aria_db -c "SELECT 1"
```

### Problema: Servidor no inicia

**Verificar:**
- [ ] Puerto 3002 disponible
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` existe
- [ ] No hay errores de sintaxis

**Solución:**
```bash
cd server
npm install
npm start
```

### Problema: Distancias incorrectas

**Verificar:**
- [ ] API Key de Google Maps válida
- [ ] Cuota de API no excedida
- [ ] Coordenadas correctas

**Solución:**
```bash
# Usar distancias aproximadas (sin API)
# O verificar API Key en .env
```

---

## 📈 Métricas de Éxito

### Sistema Operativo
- [ ] ✅ 100% de técnicos disponibles al inicio
- [ ] ✅ Tiempo de respuesta < 2 segundos
- [ ] ✅ Asignación exitosa en primer intento
- [ ] ✅ Sin errores en consola

### Experiencia de Usuario
- [ ] ✅ Dashboard carga en < 3 segundos
- [ ] ✅ Lista de técnicos visible inmediatamente
- [ ] ✅ Distancias y tiempos claros
- [ ] ✅ Asignación fluida sin recargas

### Datos
- [ ] ✅ Técnicos con ubicaciones válidas
- [ ] ✅ Especialidades correctas
- [ ] ✅ Experiencia registrada
- [ ] ✅ Teléfonos de contacto

---

## 🎓 Checklist de Entrega

### Documentación
- [x] SOLUCION_TECNICOS.md
- [x] GUIA_RAPIDA_TECNICOS.md
- [x] INSTRUCCIONES_SIMULACION_TECNICOS.md
- [x] RESUMEN_SIMULACION.md
- [x] CHECKLIST_TECNICOS.md (este archivo)

### Scripts
- [x] verificar-y-corregir-tecnicos.js
- [x] simular-tecnicos.js
- [x] simular-escenarios.js
- [x] probar-asignacion.js
- [x] diagnostico-completo.js

### Interfaces
- [x] simular-tecnicos.bat
- [x] ayuda-tecnicos.bat

### Base de Datos
- [x] Tabla tecnicos creada
- [x] 8 técnicos de prueba
- [x] Datos iniciales cargados

### API
- [x] Endpoint técnicos cercanos
- [x] Endpoint asignar técnico
- [x] Endpoint liberar técnico

---

## ✅ Verificación Final

**Ejecutar:**
```bash
cd server
node diagnostico-completo.js
```

**Resultado esperado:**
```
✅ Conexión a BD
✅ Tabla técnicos
✅ Técnicos registrados
✅ Técnicos disponibles
✅ Tabla sensores
✅ Tabla eventos
⚠️  API Key configurada (opcional)

🎉 SISTEMA COMPLETAMENTE OPERATIVO
```

---

## 📞 Comandos de Emergencia

```bash
# Resetear todo
cd server
node verificar-y-corregir-tecnicos.js
node simular-tecnicos.js

# Ver estado
node diagnostico-completo.js

# Liberar todos
node simular-escenarios.js
# Opción 7

# Probar sistema
node probar-asignacion.js
```

---

**Estado:** ✅ LISTO PARA PRODUCCIÓN

**Última verificación:** Noviembre 2025

**Próxima revisión:** Antes de cada sesión de pruebas
