# 📧 Configuración de Envío de Reportes por Correo

## 🎯 Funcionalidad

El sistema ahora puede enviar reportes de incidencias automáticamente por correo electrónico usando Gmail o cualquier servidor SMTP.

---

## 🚀 Configuración Rápida (Gmail)

### Paso 1: Habilitar Verificación en 2 Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com
2. Seguridad → Verificación en 2 pasos
3. Actívala si no está activada

### Paso 2: Generar Contraseña de Aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Windows Computer" (o cualquier dispositivo)
3. Haz clic en "Generar"
4. **Copia la contraseña de 16 caracteres** (sin espacios)

### Paso 3: Configurar el Sistema

Edita el archivo `server/.env`:

```env
# Configuración de correo (Gmail)
GMAIL_USER=tu-correo@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# Destinatarios por defecto
EMAIL_DESTINATARIOS_DEFAULT=reportes@empresa.com,supervisor@empresa.com
```

**Importante:** 
- Usa tu correo de Gmail real
- Usa la contraseña de aplicación (NO tu contraseña normal)
- Puedes agregar múltiples destinatarios separados por coma

### Paso 4: Reiniciar el Servidor

```bash
# Detener servidor actual
Get-Process -Name node | Stop-Process -Force

# Iniciar de nuevo
cd server
npm start
```

---

## 📋 Uso en el Sistema

### Opción 1: Enviar Reporte Guardado

Después de guardar un reporte en la base de datos:

```javascript
import { enviarReportePorCorreo } from './src/services/api.js';

// Enviar reporte por ID
const resultado = await enviarReportePorCorreo(
    reporteId,  // ID del reporte en la BD
    ['destinatario1@email.com', 'destinatario2@email.com']
);

console.log('Correo enviado:', resultado.messageId);
```

### Opción 2: Enviar Reporte Directo

Sin guardar en BD primero:

```javascript
import { enviarReportePorCorreoDirecto } from './src/services/api.js';

// Enviar reporte directamente
const resultado = await enviarReportePorCorreoDirecto(
    reporteData,  // Objeto con datos del reporte
    'destinatario@email.com'
);
```

### Opción 3: Usar Destinatarios por Defecto

Si no especificas destinatarios, usa los del `.env`:

```javascript
// Usa EMAIL_DESTINATARIOS_DEFAULT del .env
const resultado = await enviarReportePorCorreo(reporteId);
```

---

## 🎨 Formato del Correo

El correo incluye:

✅ **Diseño HTML profesional** con colores del Metro CDMX
✅ **Información completa** del reporte
✅ **Mapa interactivo** con enlace a Google Maps
✅ **Badge de severidad** con colores (crítico, alto, medio, bajo)
✅ **Secciones organizadas**:
   - Información general
   - Ubicación del fallo
   - Activo afectado
   - Técnico asignado
   - Diagnóstico y acciones
   - Componentes reemplazados
   - Pruebas realizadas
   - Impacto operacional
   - Observaciones y recomendaciones

---

## 🧪 Probar la Configuración

### Verificar Configuración

```bash
# Desde PowerShell
curl http://localhost:3002/api/email/verificar
```

**Respuesta esperada:**
```json
{
  "configurado": true,
  "message": "Configuración de correo OK"
}
```

### Enviar Correo de Prueba

```bash
# Crear script de prueba
cd server
node -e "
import { enviarReportePorCorreo } from './email-service.js';

const reportePrueba = {
    numeroOT: 'OT-TEST-001',
    fechaDeteccion: new Date().toLocaleString('es-MX'),
    lineaMetro: 'Línea 1',
    severidad: 'medio',
    ubicacionFallo: 'Estación Prueba',
    viaAfectada: 'Vía 1',
    puntoKilometrico: 'PK 1.5',
    coordenadasLat: 19.4326,
    coordenadasLng: -99.1332,
    tipoSensor: 'Contador de Ejes',
    idActivo: 'SENSOR-001',
    mensajeAlarma: 'Prueba de correo',
    sintomaOperacional: 'Ninguno - Prueba',
    tecnicoNombre: 'Técnico de Prueba',
    tecnicoId: 'TEC-000',
    tecnicoEspecialidad: 'Pruebas',
    horaLlegada: new Date().toLocaleString('es-MX'),
    diagnosticoPreliminar: 'Correo de prueba del sistema',
    accionesIntervencion: 'Verificación de envío de correos',
    pruebasRealizadas: 'Prueba de correo exitosa',
    tiempoTotalFormato: '00:05:00',
    impactoMinutos: 0,
    trenesAfectados: 0
};

enviarReportePorCorreo(reportePrueba, 'tu-correo@gmail.com')
    .then(() => console.log('✅ Correo de prueba enviado'))
    .catch(err => console.error('❌ Error:', err));
"
```

---

## 🔧 Configuración Alternativa (SMTP Genérico)

Si no quieres usar Gmail, puedes usar cualquier servidor SMTP:

```env
# En server/.env
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario@ejemplo.com
SMTP_PASSWORD=contraseña
```

**Ejemplos de proveedores:**

| Proveedor | Host | Puerto |
|-----------|------|--------|
| Gmail | smtp.gmail.com | 587 |
| Outlook | smtp-mail.outlook.com | 587 |
| Yahoo | smtp.mail.yahoo.com | 465 |
| Office 365 | smtp.office365.com | 587 |
| SendGrid | smtp.sendgrid.net | 587 |

---

## 📊 Integración en el Frontend

### Agregar Botón de Envío

En tu componente de reporte (ARIAApp.jsx):

```javascript
import { enviarReportePorCorreoDirecto } from './src/services/api.js';

// Después de guardar el reporte
const handleEnviarReporte = async () => {
    try {
        // Mostrar modal de confirmación
        const destinatario = prompt('Correo del destinatario:', 
            'reportes@empresa.com');
        
        if (!destinatario) return;

        // Enviar correo
        const resultado = await enviarReportePorCorreoDirecto(
            reporteData,
            destinatario
        );

        alert(`✅ Reporte enviado a ${destinatario}`);
        console.log('Message ID:', resultado.messageId);
    } catch (error) {
        alert('❌ Error al enviar correo: ' + error.message);
    }
};

// En el JSX
<button onClick={handleEnviarReporte}>
    📧 Enviar por Correo
</button>
```

### Modal de Destinatarios

Para una mejor UX, crea un modal:

```javascript
const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
const [destinatarios, setDestinatarios] = useState('');

const enviarCorreo = async () => {
    const lista = destinatarios.split(',').map(e => e.trim());
    await enviarReportePorCorreoDirecto(reporteData, lista);
    setMostrarModalCorreo(false);
    alert('✅ Reporte enviado exitosamente');
};

// Modal
{mostrarModalCorreo && (
    <div className="modal">
        <h3>Enviar Reporte por Correo</h3>
        <input
            type="text"
            placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
            value={destinatarios}
            onChange={(e) => setDestinatarios(e.target.value)}
        />
        <button onClick={enviarCorreo}>Enviar</button>
        <button onClick={() => setMostrarModalCorreo(false)}>
            Cancelar
        </button>
    </div>
)}
```

---

## ⚠️ Solución de Problemas

### Error: "Invalid login"

**Causa:** Contraseña incorrecta o no es contraseña de aplicación

**Solución:**
1. Verifica que usas contraseña de aplicación (no tu contraseña normal)
2. Genera una nueva contraseña de aplicación
3. Copia sin espacios

### Error: "Less secure app access"

**Causa:** Gmail bloqueó el acceso

**Solución:**
1. Usa contraseña de aplicación (recomendado)
2. O activa "Acceso de apps menos seguras" (no recomendado)

### Error: "Connection timeout"

**Causa:** Firewall o puerto bloqueado

**Solución:**
1. Verifica que el puerto 587 esté abierto
2. Prueba con puerto 465 (SSL)
3. Verifica configuración de firewall

### Correo no llega

**Causa:** Puede estar en spam

**Solución:**
1. Revisa carpeta de spam
2. Agrega el remitente a contactos
3. Marca como "No es spam"

---

## 📈 Mejoras Futuras

### Adjuntar Fotos

El sistema ya soporta adjuntar fotos:

```javascript
const reporte = {
    ...otrosDatos,
    fotosAdjuntas: [
        '/ruta/a/foto1.jpg',
        '/ruta/a/foto2.jpg'
    ]
};
```

### Plantillas Personalizadas

Puedes modificar `server/email-service.js` para:
- Cambiar colores y diseño
- Agregar logo de la empresa
- Personalizar el formato

### Notificaciones Automáticas

Configura envío automático al finalizar reporte:

```javascript
// En ARIAApp.jsx, después de guardar reporte
await guardarReporteFinal(reporteData);
await enviarReportePorCorreoDirecto(
    reporteData,
    process.env.EMAIL_DESTINATARIOS_DEFAULT
);
```

---

## 📞 Comandos Útiles

### Verificar Configuración
```bash
curl http://localhost:3002/api/email/verificar
```

### Ver Logs del Servidor
```bash
# Los logs mostrarán:
# ✅ Correo enviado exitosamente
# ID del mensaje: <mensaje-id>
# Destinatarios: correo@ejemplo.com
```

### Reiniciar Servidor
```bash
Get-Process -Name node | Stop-Process -Force
cd server
npm start
```

---

## ✅ Checklist de Configuración

- [ ] Verificación en 2 pasos activada en Google
- [ ] Contraseña de aplicación generada
- [ ] Variables configuradas en `server/.env`
- [ ] Servidor reiniciado
- [ ] Configuración verificada (`/api/email/verificar`)
- [ ] Correo de prueba enviado exitosamente
- [ ] Correo recibido (revisar spam si no llega)

---

## 🎉 Resultado Final

Una vez configurado, cada reporte se puede enviar automáticamente por correo con:
- ✅ Diseño profesional HTML
- ✅ Toda la información del incidente
- ✅ Mapa interactivo
- ✅ Fotos adjuntas (opcional)
- ✅ Múltiples destinatarios
- ✅ Envío instantáneo

---

**Última actualización:** Noviembre 2025
