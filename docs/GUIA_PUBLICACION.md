# 🚀 Guía de Publicación - Sistema ARIA

## 📋 Opciones de Publicación

### Opción 1: Vercel + Railway (Recomendado - Gratis)
- ✅ Frontend en Vercel (gratis)
- ✅ Backend en Railway (gratis con límites)
- ✅ Base de datos PostgreSQL incluida
- ✅ Fácil de configurar
- ✅ SSL automático

### Opción 2: Render (Todo en Uno - Gratis)
- ✅ Frontend y Backend en un solo lugar
- ✅ PostgreSQL incluido
- ✅ SSL automático
- ✅ Muy fácil de usar

### Opción 3: Servidor Propio (VPS)
- ✅ Control total
- ✅ Mejor rendimiento
- ❌ Requiere configuración manual
- ❌ Costo mensual

---

## 🎯 OPCIÓN 1: Vercel + Railway (RECOMENDADO)

### Paso 1: Preparar el Proyecto

#### 1.1 Crear archivo `.gitignore`

```bash
# En la raíz del proyecto
node_modules/
.env
.DS_Store
dist/
build/
*.log
.vscode/
```

#### 1.2 Inicializar Git (si no lo has hecho)

```bash
git init
git add .
git commit -m "Sistema ARIA completo"
```

#### 1.3 Crear repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre: `sistema-aria`
3. Descripción: "Sistema de Gestión de Incidencias Metro CDMX"
4. Público o Privado (tu elección)
5. Clic en "Create repository"

#### 1.4 Subir código a GitHub

```bash
git remote add origin https://github.com/TU-USUARIO/sistema-aria.git
git branch -M main
git push -u origin main
```

---

### Paso 2: Publicar Backend en Railway

#### 2.1 Crear cuenta en Railway

1. Ve a: https://railway.app
2. Clic en "Start a New Project"
3. Conecta con GitHub

#### 2.2 Crear Base de Datos PostgreSQL

1. Clic en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Espera a que se cree
4. Copia las credenciales (las necesitarás)

#### 2.3 Desplegar Backend

1. Clic en "+ New" → "GitHub Repo"
2. Selecciona tu repositorio `sistema-aria`
3. Clic en "Deploy Now"

#### 2.4 Configurar Variables de Entorno

En Railway, ve a tu servicio → Variables:

```env
DB_HOST=tu-host-de-railway.railway.app
DB_USER=postgres
DB_PASSWORD=tu-password-de-railway
DB_NAME=railway
DB_PORT=5432
PORT=3002

GMAIL_USER=noemipalaciosreyes@gmail.com
GMAIL_APP_PASSWORD=jykxzseocqabelnx
EMAIL_DESTINATARIOS_DEFAULT=hernandez.nava@gmail.com
```

#### 2.5 Configurar Root Directory

En Railway → Settings:
- **Root Directory:** `server`
- **Start Command:** `npm start`

#### 2.6 Obtener URL del Backend

Railway te dará una URL como:
```
https://sistema-aria-production.up.railway.app
```

**Guarda esta URL**, la necesitarás para el frontend.

---

### Paso 3: Publicar Frontend en Vercel

#### 3.1 Crear cuenta en Vercel

1. Ve a: https://vercel.com
2. Clic en "Sign Up"
3. Conecta con GitHub

#### 3.2 Importar Proyecto

1. Clic en "Add New..." → "Project"
2. Selecciona tu repositorio `sistema-aria`
3. Clic en "Import"

#### 3.3 Configurar Build Settings

- **Framework Preset:** Vite
- **Root Directory:** `.` (raíz)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

#### 3.4 Configurar Variables de Entorno

En Vercel → Settings → Environment Variables:

```env
VITE_API_URL=https://tu-backend-railway.up.railway.app/api
```

#### 3.5 Actualizar API URL en el Código

Edita `src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
```

#### 3.6 Desplegar

1. Clic en "Deploy"
2. Espera 2-3 minutos
3. ¡Listo! Tu app estará en: `https://sistema-aria.vercel.app`

---

### Paso 4: Configurar Base de Datos

#### 4.1 Conectar a PostgreSQL de Railway

```bash
# Instalar psql si no lo tienes
# Windows: https://www.postgresql.org/download/windows/

# Conectar
psql -h tu-host-railway.railway.app -U postgres -d railway
```

#### 4.2 Crear Tablas

Ejecuta los scripts SQL:

```sql
-- Copiar y pegar el contenido de:
-- server/crear-tabla-tecnicos.sql
-- server/create-tabla-reporte.sql
-- Y otros scripts necesarios
```

O usa el script de Node:

```bash
# Localmente, con las credenciales de Railway en .env
cd server
node crear-tabla-tecnicos.js
```

---

## 🎯 OPCIÓN 2: Render (Todo en Uno)

### Paso 1: Crear cuenta en Render

1. Ve a: https://render.com
2. Clic en "Get Started"
3. Conecta con GitHub

### Paso 2: Crear Base de Datos PostgreSQL

1. Dashboard → "+ New" → "PostgreSQL"
2. Nombre: `aria-db`
3. Plan: Free
4. Clic en "Create Database"
5. Guarda las credenciales

### Paso 3: Desplegar Backend

1. "+ New" → "Web Service"
2. Conecta tu repositorio
3. Configuración:
   - **Name:** `aria-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. Variables de entorno (igual que Railway)

### Paso 4: Desplegar Frontend

1. "+ New" → "Static Site"
2. Conecta tu repositorio
3. Configuración:
   - **Name:** `aria-frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

4. Variable de entorno:
   ```
   VITE_API_URL=https://aria-backend.onrender.com/api
   ```

---

## 🎯 OPCIÓN 3: Servidor Propio (VPS)

### Requisitos

- Servidor Linux (Ubuntu 22.04 recomendado)
- Mínimo 2GB RAM
- Node.js 18+
- PostgreSQL 14+
- Nginx

### Paso 1: Configurar Servidor

```bash
# Conectar por SSH
ssh usuario@tu-servidor.com

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2
```

### Paso 2: Configurar PostgreSQL

```bash
# Crear base de datos
sudo -u postgres psql
CREATE DATABASE aria_db;
CREATE USER aria_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE aria_db TO aria_user;
\q
```

### Paso 3: Clonar y Configurar Proyecto

```bash
# Clonar repositorio
cd /var/www
sudo git clone https://github.com/TU-USUARIO/sistema-aria.git
cd sistema-aria

# Instalar dependencias del backend
cd server
npm install

# Configurar .env
sudo nano .env
# Pegar configuración con credenciales de producción

# Instalar dependencias del frontend
cd ..
npm install

# Build del frontend
npm run build
```

### Paso 4: Configurar PM2

```bash
# Iniciar backend con PM2
cd /var/www/sistema-aria/server
pm2 start npm --name "aria-backend" -- start

# Guardar configuración
pm2 save
pm2 startup
```

### Paso 5: Configurar Nginx

```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/aria

# Pegar:
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /var/www/sistema-aria/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activar sitio
sudo ln -s /etc/nginx/sites-available/aria /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Paso 6: Configurar SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo certbot renew --dry-run
```

---

## 📋 Checklist de Publicación

### Antes de Publicar

- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada
- [ ] Tablas creadas en la BD
- [ ] Técnicos insertados en la BD
- [ ] Sensores cargados
- [ ] Gmail configurado
- [ ] Correo de prueba enviado

### Después de Publicar

- [ ] Frontend accesible
- [ ] Backend respondiendo
- [ ] Base de datos conectada
- [ ] Técnicos visibles
- [ ] Asignación funcionando
- [ ] Correos enviándose
- [ ] SSL/HTTPS activo
- [ ] Dominio configurado (opcional)

---

## 🔒 Seguridad en Producción

### 1. Variables de Entorno

**NUNCA** subas el archivo `.env` a GitHub:

```bash
# Asegúrate de que .env esté en .gitignore
echo ".env" >> .gitignore
```

### 2. Contraseñas Seguras

Cambia las contraseñas de producción:
- Base de datos
- Gmail (usa contraseña de aplicación diferente)

### 3. CORS

En `server/server.js`, configura CORS para producción:

```javascript
app.use(cors({
    origin: 'https://tu-dominio.com',
    credentials: true
}));
```

### 4. Rate Limiting

Instala y configura rate limiting:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 requests
});

app.use('/api/', limiter);
```

---

## 🌐 Configurar Dominio Personalizado

### En Vercel

1. Settings → Domains
2. Agregar: `aria.tu-empresa.com`
3. Configurar DNS según instrucciones

### En Railway

1. Settings → Domains
2. Agregar dominio personalizado
3. Configurar CNAME en tu DNS

---

## 📊 Monitoreo

### Logs en Railway

```bash
# Ver logs en tiempo real
railway logs
```

### Logs en Render

Dashboard → Tu servicio → Logs

### Logs en VPS

```bash
# Ver logs de PM2
pm2 logs aria-backend

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to database"

- Verifica credenciales en variables de entorno
- Verifica que la BD esté corriendo
- Verifica firewall/seguridad

### Error: "CORS policy"

- Configura CORS en el backend
- Verifica que la URL del API sea correcta

### Error: "Gmail authentication failed"

- Verifica contraseña de aplicación
- Verifica que las variables estén configuradas

---

## 💰 Costos Estimados

### Opción Gratuita (Vercel + Railway)
- **Costo:** $0/mes
- **Límites:** 
  - Railway: 500 horas/mes
  - Vercel: 100GB bandwidth/mes

### Opción VPS
- **DigitalOcean:** $6-12/mes
- **Linode:** $5-10/mes
- **AWS Lightsail:** $5-10/mes

---

## 📞 Comandos Útiles

```bash
# Ver estado de servicios
pm2 status

# Reiniciar backend
pm2 restart aria-backend

# Ver logs
pm2 logs

# Actualizar código
cd /var/www/sistema-aria
git pull
cd server && npm install
cd .. && npm install && npm run build
pm2 restart aria-backend
sudo systemctl restart nginx
```

---

## ✅ Recomendación Final

Para empezar, usa **Vercel + Railway** (Opción 1):
- ✅ Gratis
- ✅ Fácil de configurar
- ✅ SSL automático
- ✅ Escalable

Cuando necesites más recursos, migra a un VPS.

---

**¿Listo para publicar?** Empieza con la Opción 1 (Vercel + Railway) siguiendo los pasos desde el inicio.
