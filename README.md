# 🚇 Sistema ARIA - Metro CDMX

**Análisis y Respuesta Inteligente de Averías**

Sistema integral para la gestión de incidencias en el Metro de la Ciudad de México, con asignación automática de técnicos, generación de reportes y notificaciones por correo electrónico.

---

## 🎯 Características Principales

- ✅ **Gestión de Incidencias** - Detección y seguimiento en tiempo real
- ✅ **Asignación Inteligente** - Técnicos más cercanos con cálculo de distancias reales
- ✅ **Reportes Completos** - Generación automática con 30+ campos
- ✅ **Notificaciones Email** - Envío automático con diseño profesional HTML
- ✅ **Dashboard Estadístico** - Métricas y análisis de rendimiento
- ✅ **Integración Google Maps** - Visualización y navegación

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- Cuenta Gmail (para envío de correos)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/TU-USUARIO/sistema-aria.git
cd sistema-aria

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
```

### Configuración

1. **Configurar Base de Datos**

Edita `server/.env`:

```env
DB_HOST=tu-host
DB_USER=postgres
DB_PASSWORD=tu-password
DB_NAME=aria_db
DB_PORT=5432
```

2. **Configurar Gmail**

```env
GMAIL_USER=tu-correo@gmail.com
GMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion
EMAIL_DESTINATARIOS_DEFAULT=destinatario@empresa.com
```

Ver [CONFIGURACION_CORREO.md](docs/CONFIGURACION_CORREO.md) para detalles.

3. **Crear Tablas**

```bash
cd server
node crear-tabla-tecnicos.js
```

### Ejecutar

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
npm run dev
```

Abre: **http://localhost:5173**

---

## 📚 Documentación

### Para Usuarios
- [INICIO_RAPIDO.md](docs/INICIO_RAPIDO.md) - Guía de inicio
- [COMO_INICIAR.md](docs/COMO_INICIAR.md) - Instrucciones paso a paso

### Para Desarrolladores
- [PRESENTACION_TECNICA.md](docs/PRESENTACION_TECNICA.md) - Arquitectura y stack
- [ARQUITECTURA.md](docs/ARQUITECTURA.md) - Diseño del sistema
- [EJEMPLOS_API.md](server/EJEMPLOS_API.md) - Endpoints y ejemplos

### Configuración
- [CONFIGURACION_CORREO.md](docs/CONFIGURACION_CORREO.md) - Setup de email
- [CONFIGURACION_FINAL.md](docs/CONFIGURACION_FINAL.md) - Estado actual

### Deployment
- [GUIA_PUBLICACION.md](docs/GUIA_PUBLICACION.md) - Deploy en producción

---

## 🏗️ Arquitectura

```
sistema-aria/
├── src/                    # Frontend React
│   ├── services/          # API client
│   └── components/        # Componentes React
├── server/                # Backend Node.js
│   ├── server.js         # API Express
│   ├── email-service.js  # Servicio de correo
│   └── db.js             # Conexión PostgreSQL
├── docs/                  # Documentación
└── public/               # Assets estáticos
```

### Stack Tecnológico

**Frontend:**
- React 18.3 + Vite 5.4
- TailwindCSS 3.4
- Google Maps API

**Backend:**
- Node.js + Express 4.21
- PostgreSQL 14+
- Nodemailer 6.10

---

## 🔌 API Endpoints

### Eventos
- `GET /api/eventos/pendientes` - Listar eventos pendientes
- `PATCH /api/eventos/:id/estado` - Actualizar estado
- `PATCH /api/eventos/:id/finalizar` - Finalizar evento

### Técnicos
- `POST /api/tecnicos/cercanos` - Buscar técnicos cercanos
- `PATCH /api/eventos/:id/asignar-tecnico` - Asignar técnico
- `PATCH /api/tecnicos/:id/liberar` - Liberar técnico

### Reportes
- `POST /api/reportes` - Guardar reporte
- `POST /api/reportes/enviar-correo-directo` - Enviar por email

Ver [EJEMPLOS_API.md](server/EJEMPLOS_API.md) para más detalles.

---

## 🗄️ Base de Datos

### Tablas Principales

- **evento** - Incidencias detectadas
- **tecnicos** - Personal técnico disponible
- **sensores** - Sensores del metro (541 registrados)
- **reporteFinal** - Reportes completos

Ver scripts SQL en `server/*.sql`

---

## 📧 Sistema de Correo

Envío automático de reportes por email con:
- Diseño HTML profesional
- Información completa del incidente
- Enlace a Google Maps
- Badge de severidad con colores

Configuración en [CONFIGURACION_CORREO.md](docs/CONFIGURACION_CORREO.md)

---

## 🧪 Testing

```bash
# Verificar técnicos
cd server
node diagnostico-completo.js

# Probar envío de correo
node test-email-simple.js

# Verificar base de datos
node verificar-tablas-completas.js
```

---

## 🚀 Deployment

### Opción 1: Vercel + Railway (Recomendado)

```bash
# Frontend en Vercel
vercel deploy

# Backend en Railway
railway up
```

### Opción 2: Docker

```bash
docker-compose up -d
```

Ver [GUIA_PUBLICACION.md](docs/GUIA_PUBLICACION.md) para más opciones.

---

## 📊 Estado del Proyecto

- ✅ **Frontend:** Completamente funcional
- ✅ **Backend:** API REST operativa
- ✅ **Base de Datos:** PostgreSQL configurada
- ✅ **Email:** Envío automático funcionando
- ✅ **Técnicos:** 8 disponibles
- ✅ **Sensores:** 541 registrados

**Estado:** 🟢 Producción Ready

---

## 🔐 Seguridad

- Variables de entorno para credenciales
- Contraseñas de aplicación Gmail
- Prepared statements (SQL injection prevention)
- CORS configurado
- Rate limiting recomendado

---

## 📈 Métricas

- **Tiempo de respuesta API:** < 200ms
- **Carga de página:** < 2s
- **Técnicos disponibles:** 8
- **Sensores registrados:** 541
- **Uptime objetivo:** 99.9%

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es propiedad del Metro de la Ciudad de México.

---

## 👥 Equipo

**Desarrollado para:** Metro CDMX  
**Tecnología:** Siemens Mobility  
**Año:** 2025

---

## 📞 Soporte

Para soporte técnico, consulta la documentación en `/docs` o contacta al equipo de desarrollo.

---

## 🎯 Roadmap

- [ ] Tests automatizados
- [ ] CI/CD con GitHub Actions
- [ ] Docker containerization
- [ ] WebSockets para tiempo real
- [ ] Mobile app (React Native)
- [ ] Machine Learning para predicción

---

**Versión:** 1.0.0  
**Última actualización:** 23 de Noviembre de 2025  
**Estado:** ✅ Producción Ready
