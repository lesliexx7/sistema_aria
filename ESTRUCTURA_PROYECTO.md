# 📁 Estructura del Proyecto - Sistema ARIA

## 🗂️ Organización de Archivos

```
sistema-aria/
│
├── 📄 README.md                          # Documentación principal
├── 📄 .gitignore                         # Archivos ignorados por Git
├── 📄 package.json                       # Dependencias frontend
├── 📄 vite.config.js                     # Configuración Vite
├── 📄 tailwind.config.js                 # Configuración TailwindCSS
│
├── 📁 src/                               # Código fuente frontend
│   ├── 📄 main.jsx                       # Punto de entrada React
│   ├── 📄 App.jsx                        # Componente principal
│   ├── 📄 ARIAApp.jsx                    # App de gestión de incidencias
│   ├── 📄 Dashboard.jsx                  # Dashboard de estadísticas
│   ├── 📄 TechnicianView.jsx             # Vista para técnicos
│   ├── 📄 LoginScreen.jsx                # Pantalla de login
│   ├── 📄 sensorsData.js                 # Datos de sensores
│   ├── 📄 technicianData.js              # Datos de técnicos
│   ├── 📄 index.css                      # Estilos globales
│   └── 📁 services/
│       └── 📄 api.js                     # Cliente API REST
│
├── 📁 server/                            # Backend Node.js
│   ├── 📄 package.json                   # Dependencias backend
│   ├── 📄 .env                           # Variables de entorno (NO SUBIR)
│   ├── 📄 server.js                      # API Express principal
│   ├── 📄 db.js                          # Conexión PostgreSQL
│   ├── 📄 email-service.js               # Servicio de correo
│   │
│   ├── 📁 Scripts SQL
│   ├── 📄 crear-tabla-tecnicos.sql       # Tabla técnicos
│   ├── 📄 crear-tabla-tecnicos.js        # Script Node para crear tabla
│   ├── 📄 create-tabla-reporte.sql       # Tabla reportes
│   ├── 📄 add-tiempo-atencion.sql        # Agregar columna
│   │
│   ├── 📁 Scripts de Verificación
│   ├── 📄 diagnostico-completo.js        # Diagnóstico del sistema
│   ├── 📄 verificar-tablas-completas.js  # Verificar tablas
│   ├── 📄 verificar-sensores.js          # Verificar sensores
│   ├── 📄 verificar-tecnicos.js          # Verificar técnicos
│   ├── 📄 test-db.js                     # Test de conexión BD
│   │
│   ├── 📁 Scripts de Simulación
│   ├── 📄 simular-tecnicos.js            # Simular técnicos disponibles
│   ├── 📄 simular-escenarios.js          # Simulador interactivo
│   ├── 📄 verificar-y-corregir-tecnicos.js
│   │
│   ├── 📁 Scripts de Email
│   ├── 📄 test-email-simple.js           # Probar envío de correo
│   ├── 📄 test-email-hernandez.js        # Test a destinatario
│   ├── 📄 probar-correo.js               # Prueba interactiva
│   ├── 📄 test-env.js                    # Verificar variables
│   │
│   └── 📁 Documentación Backend
│       ├── 📄 README.md                  # Documentación backend
│       └── 📄 EJEMPLOS_API.md            # Ejemplos de uso API
│
├── 📁 docs/                              # Documentación del proyecto
│   ├── 📄 PRESENTACION_TECNICA.md        # Documentación técnica completa
│   ├── 📄 ARQUITECTURA.md                # Arquitectura del sistema
│   ├── 📄 GUIA_PUBLICACION.md            # Guía de deployment
│   ├── 📄 CONFIGURACION_CORREO.md        # Setup de email
│   ├── 📄 CONFIGURACION_FINAL.md         # Estado actual
│   ├── 📄 INICIO_RAPIDO.md               # Guía de inicio
│   ├── 📄 COMO_INICIAR.md                # Instrucciones detalladas
│   │
│   ├── 📁 Técnicos
│   ├── 📄 README_TECNICOS.md             # Sistema de técnicos
│   ├── 📄 SOLUCION_TECNICOS.md           # Solución implementada
│   ├── 📄 GUIA_RAPIDA_TECNICOS.md        # Referencia rápida
│   ├── 📄 CHECKLIST_TECNICOS.md          # Lista de verificación
│   ├── 📄 RESUMEN_SIMULACION.md          # Resumen de simulación
│   ├── 📄 INSTRUCCIONES_SIMULACION_TECNICOS.md
│   │
│   ├── 📁 Email
│   ├── 📄 CORREO_CONFIGURADO.md          # Estado del correo
│   ├── 📄 ENVIO_AUTOMATICO_CORREO.md     # Envío automático
│   ├── 📄 RESUMEN_CORREO.md              # Resumen ejecutivo
│   ├── 📄 PASOS_CONFIGURAR_GMAIL.md      # Configurar Gmail
│   ├── 📄 EJEMPLO_INTEGRACION_CORREO.jsx # Ejemplos de código
│   │
│   └── 📁 Integración
│       ├── 📄 README_INTEGRACION.md      # Guía de integración
│       ├── 📄 INSTRUCCIONES_INTEGRACION.md
│       ├── 📄 INSTRUCCIONES_ACTUALIZACION.md
│       ├── 📄 CHECKLIST_VERIFICACION.md
│       ├── 📄 RESUMEN_IMPLEMENTACION.md
│       └── 📄 SISTEMA_COMPLETO.md
│
├── 📁 public/                            # Assets estáticos
│   └── 📄 index.html                     # HTML principal
│
├── 📁 scripts/                           # Scripts de utilidad
│   ├── 📄 iniciar-sistema.bat            # Iniciar sistema (Windows)
│   ├── 📄 iniciar-con-tecnicos.bat       # Iniciar con técnicos
│   ├── 📄 simular-tecnicos.bat           # Menú de simulación
│   ├── 📄 ayuda-tecnicos.bat             # Ayuda rápida
│   ├── 📄 probar-sistema-completo.bat    # Prueba completa
│   └── 📄 inicializar-sistema-completo.bat
│
└── 📁 .vscode/                           # Configuración VS Code
    ├── 📄 settings.json                  # Settings del editor
    └── 📄 launch.json                    # Configuración de debug
```

---

## 📦 Archivos Importantes

### Configuración
- `.env` - Variables de entorno (NO SUBIR A GIT)
- `.gitignore` - Archivos ignorados
- `package.json` - Dependencias y scripts
- `vite.config.js` - Configuración del bundler

### Código Principal
- `src/ARIAApp.jsx` - Aplicación principal (~1,300 líneas)
- `server/server.js` - API REST (~450 líneas)
- `server/email-service.js` - Servicio de correo (~450 líneas)

### Documentación
- `README.md` - Documentación principal
- `docs/PRESENTACION_TECNICA.md` - Documentación técnica
- `docs/GUIA_PUBLICACION.md` - Guía de deployment

---

## 🚫 Archivos NO Incluir en Git

```
# Ya están en .gitignore
node_modules/
.env
dist/
*.log
.DS_Store
```

---

## 📝 Archivos a Revisar Antes de Subir

1. **server/.env** - Remover credenciales reales
2. **src/services/api.js** - Verificar URL de API
3. **server/server.js** - Verificar configuración CORS
4. **README.md** - Actualizar URLs y nombres

---

## 🔄 Comandos para Organizar

```bash
# Crear carpeta docs
mkdir docs

# Mover documentación
mv *_TECNICOS.md docs/
mv *_CORREO.md docs/
mv PRESENTACION_TECNICA.md docs/
mv GUIA_PUBLICACION.md docs/
mv ARQUITECTURA.md docs/

# Crear carpeta scripts
mkdir scripts
mv *.bat scripts/

# Limpiar archivos temporales
rm -rf node_modules/
rm -rf dist/
rm -rf *.log
```

---

## 📊 Estadísticas del Proyecto

- **Total de archivos:** ~100
- **Líneas de código:** ~5,000
- **Componentes React:** 5
- **Endpoints API:** 12
- **Tablas BD:** 4
- **Scripts SQL:** 5
- **Documentación:** 30+ archivos

---

## ✅ Checklist Pre-Commit

- [ ] Remover credenciales de .env
- [ ] Actualizar README.md
- [ ] Verificar .gitignore
- [ ] Limpiar node_modules
- [ ] Remover archivos temporales
- [ ] Verificar que el código compile
- [ ] Actualizar versión en package.json

---

**Última actualización:** 23 de Noviembre de 2025
