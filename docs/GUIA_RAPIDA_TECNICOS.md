# 🚀 Guía Rápida - Simulación de Técnicos

## ⚡ Inicio Rápido (3 pasos)

### 1. Ejecutar el Simulador

```bash
simular-tecnicos.bat
```

Selecciona **Opción 1** (Verificar y corregir)

### 2. Iniciar el Sistema

```bash
# Terminal 1
cd server
npm start

# Terminal 2 (nueva terminal)
npm run dev
```

### 3. Probar en el Navegador

Abre: http://localhost:5173

---

## 🎯 Comandos Útiles

### Ver Estado Actual

```bash
cd server
node verificar-y-corregir-tecnicos.js
```

### Todos Disponibles

```bash
cd server
node simular-tecnicos.js
```

### Escenarios Interactivos

```bash
cd server
node simular-escenarios.js
```

### Probar Asignación

```bash
cd server
node probar-asignacion.js
```

---

## 📊 Escenarios Rápidos

| Comando | Resultado |
|---------|-----------|
| `simular-escenarios.js` → 1 | 8 técnicos disponibles |
| `simular-escenarios.js` → 2 | 4 técnicos disponibles |
| `simular-escenarios.js` → 3 | 2 técnicos disponibles |
| `simular-escenarios.js` → 4 | Técnicos cerca de sensor |
| `simular-escenarios.js` → 7 | Liberar todos |

---

## ❌ Solución de Problemas

### "No hay técnicos disponibles"

```bash
cd server
node verificar-y-corregir-tecnicos.js
```

### "Error al conectar a BD"

Verifica que PostgreSQL esté corriendo

### "Error al calcular distancias"

Verifica API Key en `server/.env`

---

## ✅ Verificación Rápida

```bash
# 1. Ver técnicos
cd server
node verificar-y-corregir-tecnicos.js

# 2. Probar API (con servidor corriendo)
cd server
node probar-asignacion.js
```

---

## 📁 Archivos Creados

- ✅ `server/verificar-y-corregir-tecnicos.js`
- ✅ `server/simular-tecnicos.js`
- ✅ `server/simular-escenarios.js`
- ✅ `server/probar-asignacion.js`
- ✅ `simular-tecnicos.bat`

---

## 🎓 Flujo Completo

```
1. simular-tecnicos.bat (Opción 1)
   ↓
2. npm start (en server/)
   ↓
3. npm run dev (en raíz)
   ↓
4. Abrir navegador
   ↓
5. Probar asignación
```

---

**¿Listo?** Ejecuta `simular-tecnicos.bat` y selecciona la opción 1.
