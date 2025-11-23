# 📧 Envío de Reportes por Correo - Resumen

## ✅ Funcionalidad Implementada

El sistema ARIA ahora puede enviar reportes de incidencias automáticamente por correo electrónico con diseño profesional HTML.

---

## 🚀 Configuración Rápida (3 pasos)

### 1. Generar Contraseña de Aplicación de Gmail

1. Ve a: https://myaccount.google.com/apppasswords
2. Genera una contraseña de aplicación
3. Copia la contraseña (16 caracteres)

### 2. Configurar Variables

Edita `server/.env`:

```env
GMAIL_USER=tu-correo@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
EMAIL_DESTINATARIOS_DEFAULT=reportes@empresa.com
```

### 3. Reiniciar Servidor

```bash
Get-Process -Name node | Stop-Process -Force
cd server
npm start
```

---

## 🧪 Probar Envío

```bash
cd server
node probar-correo.js
```

El script te guiará para enviar un correo de prueba.

---

## 📊 Características del Correo

✅ **Diseño HTML profesional** con colores del Metro
✅ **Información completa** del reporte
✅ **Mapa interactivo** (enlace a Google Maps)
✅ **Badge de severidad** con colores
✅ **Secciones organizadas**:
   - Información general
   - Ubicación del fallo
   - Activo afectado
   - Técnico asignado
   - Diagnóstico y acciones
   - Pruebas realizadas
   - Impacto operacional
   - Observaciones y recomendaciones

---

## 💻 Uso en el Código

### Enviar Reporte Guardado

```javascript
import { enviarReportePorCorreo } from './src/services/api.js';

await enviarReportePorCorreo(
    reporteId,  // ID del reporte en BD
    'destinatario@email.com'
);
```

### Enviar Reporte Directo

```javascript
import { enviarReportePorCorreoDirecto } from './src/services/api.js';

await enviarReportePorCorreoDirecto(
    reporteData,  // Objeto con datos
    ['correo1@email.com', 'correo2@email.com']
);
```

---

## 🔧 API Endpoints

### POST /api/reportes/enviar-correo
Envía un reporte guardado en BD

**Body:**
```json
{
  "reporteId": 123,
  "destinatarios": "correo@ejemplo.com"
}
```

### POST /api/reportes/enviar-correo-directo
Envía un reporte sin guardar en BD

**Body:**
```json
{
  "reporte": { ...datos... },
  "destinatarios": ["correo1@ejemplo.com", "correo2@ejemplo.com"]
}
```

### GET /api/email/verificar
Verifica configuración de correo

**Respuesta:**
```json
{
  "configurado": true,
  "message": "Configuración de correo OK"
}
```

---

## 📁 Archivos Creados

- ✅ `server/email-service.js` - Servicio de envío de correos
- ✅ `server/probar-correo.js` - Script de prueba
- ✅ `CONFIGURACION_CORREO.md` - Guía completa
- ✅ `RESUMEN_CORREO.md` - Este archivo

---

## ⚠️ Solución Rápida de Problemas

### "Invalid login"
→ Usa contraseña de aplicación, no tu contraseña normal

### "Connection timeout"
→ Verifica que el puerto 587 esté abierto

### Correo no llega
→ Revisa carpeta de spam

---

## 📖 Documentación Completa

Lee `CONFIGURACION_CORREO.md` para:
- Configuración detallada
- Integración en el frontend
- Solución de problemas
- Ejemplos de código
- Configuración SMTP alternativa

---

## ✅ Checklist

- [ ] Contraseña de aplicación generada
- [ ] Variables configuradas en `.env`
- [ ] Servidor reiniciado
- [ ] Prueba de correo exitosa
- [ ] Correo recibido

---

**¿Listo?** → Ejecuta `node server/probar-correo.js`
