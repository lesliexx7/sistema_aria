# 🚀 Inicio Rápido - Sistema ARIA

## ⚡ 3 Pasos para Iniciar

### 1️⃣ Probar Conexión
```bash
cd server
npm install
npm run test-db
```

### 2️⃣ Iniciar Backend
```bash
cd server
npm run dev
```
✅ Servidor en: http://localhost:3001

### 3️⃣ Iniciar Frontend (nueva terminal)
```bash
npm run dev
```
✅ Aplicación en: http://localhost:5173

## 📊 ¿Qué hace el sistema?

1. **Extrae eventos** de la tabla `eventos` (PostgreSQL)
2. **Obtiene datos del sensor**: línea y coordenadas GPS
3. **Asigna técnico** más cercano automáticamente
4. **Muestra en interfaz** con lista de tickets pendientes
5. **Actualiza estados** en tiempo real en la base de datos

## 📁 Documentación Completa

- `INSTRUCCIONES_INTEGRACION.md` - Guía detallada paso a paso
- `ARQUITECTURA.md` - Diagrama de arquitectura del sistema
- `RESUMEN_IMPLEMENTACION.md` - Resumen de todo lo implementado
- `CHECKLIST_VERIFICACION.md` - Lista de verificación completa
- `server/README.md` - Documentación del backend
- `server/EJEMPLOS_API.md` - Ejemplos de uso de la API

## 🔧 Endpoints Principales

```bash
# Health check
curl http://localhost:3001/health

# Obtener eventos pendientes
curl http://localhost:3001/api/eventos/pendientes

# Actualizar estado
curl -X PATCH http://localhost:3001/api/eventos/123/estado ^
  -H "Content-Type: application/json" ^
  -d "{\"estado\":\"en-camino\"}"
```

## ✅ Verificación Rápida

1. ✅ Backend corriendo en puerto 3001
2. ✅ Frontend corriendo en puerto 5173
3. ✅ Barra naranja de eventos pendientes aparece
4. ✅ Click en ticket carga el evento
5. ✅ Cambio de estado actualiza la base de datos

## 🐛 Problema?

Ver `CHECKLIST_VERIFICACION.md` sección "Problemas Comunes"

---

**¡Listo! El sistema está integrado con la base de datos. 🎉**
