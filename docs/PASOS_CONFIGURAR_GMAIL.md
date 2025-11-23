# 📧 Cómo Configurar Gmail para Enviar Correos

## ⚠️ Problema Actual

Gmail rechaza la conexión porque estás usando tu contraseña normal (`Iamatics5.0`).

Gmail requiere una **Contraseña de Aplicación** especial de 16 caracteres.

---

## ✅ Solución (5 minutos)

### Paso 1: Activar Verificación en 2 Pasos

1. Abre: https://myaccount.google.com/security
2. Busca **"Verificación en 2 pasos"**
3. Si dice "Desactivada", haz clic y actívala
4. Sigue los pasos (te pedirá tu número de teléfono)

**Nota:** Si ya está activada, pasa al Paso 2.

---

### Paso 2: Generar Contraseña de Aplicación

1. Abre: https://myaccount.google.com/apppasswords

2. Inicia sesión con: `noemipalaciosreyes@gmail.com`

3. Verás una pantalla como esta:
   ```
   Contraseñas de aplicaciones
   
   Seleccionar app: [Correo ▼]
   Seleccionar dispositivo: [Windows Computer ▼]
   
   [Generar]
   ```

4. Selecciona:
   - App: **Correo**
   - Dispositivo: **Windows Computer** (o "Otro")

5. Haz clic en **"Generar"**

6. Te mostrará una contraseña como esta:
   ```
   abcd efgh ijkl mnop
   ```
   (16 caracteres en grupos de 4)

7. **COPIA ESA CONTRASEÑA** (puedes copiarla con o sin espacios)

---

### Paso 3: Actualizar el Archivo .env

1. Abre el archivo: `server/.env`

2. Busca estas líneas:
   ```env
   GMAIL_USER=noemipalaciosreyes@gmail.com
   GMAIL_APP_PASSWORD=aqui-pega-la-contraseña-de-16-caracteres
   ```

3. Reemplaza `aqui-pega-la-contraseña-de-16-caracteres` con la contraseña que copiaste

4. Ejemplo:
   ```env
   GMAIL_USER=noemipalaciosreyes@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
   (sin espacios, todo junto)

5. **Guarda el archivo** (Ctrl + S)

---

### Paso 4: Reiniciar el Servidor

Abre PowerShell y ejecuta:

```powershell
# Detener procesos
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Iniciar servidor
cd server
npm start
```

---

### Paso 5: Probar el Envío

```powershell
cd server
node probar-correo.js
```

Cuando te pregunte el correo, usa: `palaciosleslienoemi@gmail.com`

---

## 🎯 Resultado Esperado

Si todo está bien, verás:

```
✅ Configuración de correo OK
📧 Enviando correo...
✅ ¡CORREO ENVIADO EXITOSAMENTE!
```

Y recibirás el correo en tu bandeja de entrada.

---

## ❌ Si Sigue Sin Funcionar

### Error: "Invalid login"

**Causa:** La contraseña de aplicación está mal

**Solución:**
1. Genera una nueva contraseña de aplicación
2. Cópiala exactamente como aparece
3. Pégala en el .env sin espacios
4. Guarda y reinicia el servidor

### Error: "Less secure app access"

**Causa:** Verificación en 2 pasos no está activada

**Solución:**
1. Ve a: https://myaccount.google.com/security
2. Activa "Verificación en 2 pasos"
3. Luego genera la contraseña de aplicación

### No puedo acceder a "Contraseñas de aplicaciones"

**Causa:** Verificación en 2 pasos no está activada

**Solución:**
Primero activa la verificación en 2 pasos, luego podrás acceder a las contraseñas de aplicaciones.

---

## 📝 Resumen

1. ✅ Activar verificación en 2 pasos
2. ✅ Generar contraseña de aplicación (16 caracteres)
3. ✅ Pegar en `server/.env`
4. ✅ Guardar archivo
5. ✅ Reiniciar servidor
6. ✅ Probar con `node probar-correo.js`

---

## 🔗 Enlaces Útiles

- Verificación en 2 pasos: https://myaccount.google.com/security
- Contraseñas de aplicaciones: https://myaccount.google.com/apppasswords
- Ayuda de Google: https://support.google.com/accounts/answer/185833

---

## 💡 Nota Importante

**NO uses tu contraseña normal de Gmail** (`Iamatics5.0`)

**USA la contraseña de aplicación** de 16 caracteres que genera Google

Esta es una contraseña especial solo para aplicaciones y es más segura.

---

**¿Listo?** → Ve a https://myaccount.google.com/apppasswords y genera tu contraseña
