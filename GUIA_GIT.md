# 🚀 Guía Rápida - Subir a GitHub

## 📋 Preparación (Solo una vez)

### 1. Preparar el Proyecto

```bash
# Ejecutar script de preparación
preparar-para-subir.bat
```

Este script:
- ✅ Crea carpetas `docs/` y `scripts/`
- ✅ Organiza la documentación
- ✅ Limpia archivos temporales
- ✅ Verifica .gitignore

### 2. Proteger Credenciales

**IMPORTANTE:** Antes de subir, edita `server/.env`:

```bash
# Opción 1: Remover el archivo
rm server/.env

# Opción 2: Reemplazar con valores de ejemplo
# Usa server/.env.example como referencia
```

---

## 🔧 Comandos Git

### Inicializar Repositorio

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Sistema ARIA - Versión inicial completa"
```

### Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre: `sistema-aria`
3. Descripción: "Sistema de Gestión de Incidencias Metro CDMX"
4. Público o Privado (tu elección)
5. **NO** inicialices con README (ya lo tienes)
6. Clic en "Create repository"

### Conectar y Subir

```bash
# Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/sistema-aria.git

# Renombrar rama a main
git branch -M main

# Subir código
git push -u origin main
```

---

## 🔄 Comandos Comunes

### Ver Estado

```bash
# Ver archivos modificados
git status

# Ver diferencias
git diff
```

### Hacer Cambios

```bash
# Agregar archivos específicos
git add archivo.js

# Agregar todos los cambios
git add .

# Commit con mensaje
git commit -m "Descripción del cambio"

# Subir cambios
git push
```

### Crear Ramas

```bash
# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main

# Listar ramas
git branch
```

### Actualizar desde GitHub

```bash
# Descargar cambios
git pull origin main
```

---

## 📝 Mensajes de Commit Recomendados

```bash
# Nuevas características
git commit -m "feat: Agregar sistema de notificaciones"

# Correcciones
git commit -m "fix: Corregir cálculo de distancias"

# Documentación
git commit -m "docs: Actualizar README con instrucciones"

# Refactorización
git commit -m "refactor: Optimizar queries de base de datos"

# Estilos
git commit -m "style: Mejorar diseño de formularios"

# Tests
git commit -m "test: Agregar tests para API de técnicos"
```

---

## 🔒 Seguridad

### Archivos que NUNCA debes subir

```
❌ server/.env (credenciales reales)
❌ node_modules/ (dependencias)
❌ dist/ (archivos compilados)
❌ *.log (logs)
❌ .DS_Store (archivos de sistema)
```

### Verificar antes de subir

```bash
# Ver qué archivos se subirán
git status

# Ver contenido de archivos
git diff

# Si subiste algo por error
git reset HEAD archivo.js
```

---

## 🆘 Solución de Problemas

### Error: "remote origin already exists"

```bash
# Remover origin existente
git remote remove origin

# Agregar nuevo origin
git remote add origin https://github.com/TU-USUARIO/sistema-aria.git
```

### Error: "failed to push"

```bash
# Forzar push (cuidado, sobrescribe)
git push -f origin main

# O mejor, pull primero
git pull origin main --rebase
git push origin main
```

### Subí credenciales por error

```bash
# Remover archivo del historial
git rm --cached server/.env
git commit -m "Remover credenciales"
git push

# Cambiar credenciales inmediatamente
# (contraseñas, API keys, etc.)
```

---

## 📊 Verificar Repositorio

Después de subir, verifica en GitHub:

- ✅ README.md se muestra correctamente
- ✅ Estructura de carpetas correcta
- ✅ No hay archivos .env
- ✅ No hay node_modules/
- ✅ Documentación en /docs
- ✅ Scripts en /scripts

---

## 🎯 Comandos Completos (Copy-Paste)

```bash
# 1. Preparar proyecto
preparar-para-subir.bat

# 2. Inicializar Git
git init
git add .
git commit -m "Sistema ARIA - Versión inicial completa"

# 3. Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/sistema-aria.git
git branch -M main
git push -u origin main
```

---

## ✅ Checklist Final

Antes de hacer `git push`:

- [ ] Ejecuté `preparar-para-subir.bat`
- [ ] Removí credenciales de server/.env
- [ ] Verifiqué .gitignore
- [ ] Limpié node_modules/
- [ ] Actualicé README.md con mi usuario
- [ ] Hice `git status` para verificar
- [ ] Creé repositorio en GitHub
- [ ] Estoy listo para subir

---

## 🎉 ¡Listo!

Tu proyecto estará en:
```
https://github.com/TU-USUARIO/sistema-aria
```

Comparte el link con tu equipo y empieza a colaborar.

---

**Última actualización:** 23 de Noviembre de 2025
