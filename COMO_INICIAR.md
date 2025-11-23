# 🚀 Cómo Iniciar el Sistema (SIMPLE)

## Opción 1: Un Solo Click (MÁS FÁCIL)

### Doble click en:
```
iniciar-con-tecnicos.bat
```

Eso es todo. El script hará:
1. ✅ Preparar técnicos
2. ✅ Iniciar servidor
3. ✅ Iniciar frontend
4. ✅ Abrir navegador

---

## Opción 2: Manual (3 pasos)

### Paso 1: Preparar Técnicos
Doble click en:
```
simular-tecnicos.bat
```
Selecciona opción **1**

### Paso 2: Iniciar Servidor
Abre una terminal (cmd) y ejecuta:
```bash
cd server
npm start
```
**NO CIERRES esta ventana**

### Paso 3: Iniciar Frontend
Abre OTRA terminal (cmd) y ejecuta:
```bash
npm run dev
```
**NO CIERRES esta ventana**

### Paso 4: Abrir Navegador
```
http://localhost:5173
```

---

## ❌ Si Sigue Diciendo "No Hay Técnicos"

### Verificar que el servidor esté corriendo:

1. Abre una terminal
2. Ejecuta:
```bash
cd server
npm start
```

3. Deberías ver:
```
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en http://localhost:3002
```

### Si el servidor NO inicia:

```bash
cd server
npm install
npm start
```

### Verificar técnicos en la base de datos:

```bash
cd server
node diagnostico-completo.js
```

Deberías ver:
```
✅ 8 técnicos disponibles
```

---

## 🔍 Diagnóstico Rápido

### ¿El servidor está corriendo?
Abre: http://localhost:3002/health

Deberías ver:
```json
{"status":"OK","timestamp":"..."}
```

### ¿Hay técnicos disponibles?
```bash
cd server
node verificar-y-corregir-tecnicos.js
```

### ¿El frontend se conecta al servidor?
Abre la consola del navegador (F12) y busca errores.

---

## 📞 Comandos de Emergencia

### Resetear todo:
```bash
cd server
node verificar-y-corregir-tecnicos.js
```

### Ver estado:
```bash
cd server
node diagnostico-completo.js
```

### Probar API manualmente:
```bash
cd server
node probar-asignacion.js
```

---

## ✅ Checklist

Antes de usar el sistema, verifica:

- [ ] PostgreSQL está corriendo
- [ ] Servidor backend iniciado (puerto 3002)
- [ ] Frontend iniciado (puerto 5173)
- [ ] Técnicos disponibles (8/8)
- [ ] Navegador abierto en http://localhost:5173

---

## 🎯 Flujo Completo

```
1. Doble click: iniciar-con-tecnicos.bat
   ↓
2. Esperar que abran 2 ventanas
   ↓
3. Abrir navegador: http://localhost:5173
   ↓
4. Ver eventos pendientes
   ↓
5. Click en "Asignar Técnico"
   ↓
6. Ver lista de técnicos disponibles
   ↓
7. Seleccionar técnico
   ↓
8. ¡Listo!
```

---

## ⚠️ Problemas Comunes

### "No hay técnicos disponibles"
**Causa:** Servidor no está corriendo o técnicos no están en BD

**Solución:**
```bash
# Terminal 1
cd server
npm start

# Terminal 2 (nueva)
cd server
node verificar-y-corregir-tecnicos.js
```

### "Error de conexión"
**Causa:** PostgreSQL no está corriendo

**Solución:**
```bash
# Windows
net start postgresql-x64-14
```

### "Puerto 3002 en uso"
**Causa:** Servidor ya está corriendo

**Solución:**
Cierra la ventana del servidor anterior o usa otro puerto.

---

**¿Listo?** → Doble click en `iniciar-con-tecnicos.bat`
