# 🚂 Railway - Resumen Rápido

## 🎯 En 5 Pasos Simples

### 1️⃣ Preparar Proyecto
```bash
# Doble click en:
preparar_para_github.bat
```

### 2️⃣ Subir a GitHub
1. Ve a: https://github.com/new
2. Crea repositorio: `metro-cdmx`
3. Copia y pega los comandos que GitHub te muestra

### 3️⃣ Crear Cuenta en Railway
1. Ve a: https://railway.app
2. Login con GitHub

### 4️⃣ Desplegar
1. En Railway: "New Project"
2. "Deploy from GitHub repo"
3. Selecciona `metro-cdmx`
4. Espera 2-3 minutos
5. Click en "Generate Domain"

### 5️⃣ Actualizar Dashboard
En `dashboard_v3.html`, busca (línea ~1080):
```javascript
const API_URL = 'http://localhost:5000/api';
```

Cámbialo por:
```javascript
const API_URL = 'https://TU-URL-DE-RAILWAY.up.railway.app/api';
```

---

## 🌐 URLs Finales

**API (Railway):**
```
https://metro-cdmx-production.up.railway.app
```

**Dashboard (Netlify):**
```
https://metro-cdmx-dashboard.netlify.app/dashboard_v3.html
```

---

## ✅ Verificar

**Probar API:**
```
https://TU-URL.up.railway.app/api/health
```

Debe mostrar:
```json
{"status": "ok", "message": "API de sensores funcionando correctamente"}
```

---

## 📚 Documentación Completa

Lee: `RAILWAY_PASO_A_PASO.md` para instrucciones detalladas

---

## 💰 Costo

- ✅ Railway: GRATIS (500 horas/mes)
- ✅ Netlify: GRATIS (100GB/mes)
- ✅ Total: $0/mes

---

## 🆘 ¿Problemas?

Consulta la sección "Solución de Problemas" en `RAILWAY_PASO_A_PASO.md`

---

**¡Tu app estará en la web en menos de 30 minutos! 🚀**
