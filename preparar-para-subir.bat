@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     PREPARAR PROYECTO PARA SUBIR A GITHUB             ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Este script preparará el proyecto para subirlo a GitHub
echo.
pause

echo.
echo 📁 Paso 1: Creando estructura de carpetas...
echo.

if not exist "docs" mkdir docs
if not exist "scripts" mkdir scripts

echo ✅ Carpetas creadas
echo.

echo 📝 Paso 2: Moviendo documentación a /docs...
echo.

move /Y PRESENTACION_TECNICA.md docs\ 2>nul
move /Y GUIA_PUBLICACION.md docs\ 2>nul
move /Y CONFIGURACION_FINAL.md docs\ 2>nul
move /Y CONFIGURACION_CORREO.md docs\ 2>nul
move /Y CORREO_CONFIGURADO.md docs\ 2>nul
move /Y ENVIO_AUTOMATICO_CORREO.md docs\ 2>nul
move /Y RESUMEN_CORREO.md docs\ 2>nul
move /Y PASOS_CONFIGURAR_GMAIL.md docs\ 2>nul
move /Y README_TECNICOS.md docs\ 2>nul
move /Y SOLUCION_TECNICOS.md docs\ 2>nul
move /Y GUIA_RAPIDA_TECNICOS.md docs\ 2>nul
move /Y CHECKLIST_TECNICOS.md docs\ 2>nul
move /Y RESUMEN_SIMULACION.md docs\ 2>nul
move /Y INSTRUCCIONES_SIMULACION_TECNICOS.md docs\ 2>nul
move /Y EJEMPLO_INTEGRACION_CORREO.jsx docs\ 2>nul
move /Y SOLUCION_FINAL.md docs\ 2>nul
move /Y LEEME_PRIMERO.txt docs\ 2>nul

echo ✅ Documentación movida
echo.

echo 🔧 Paso 3: Moviendo scripts a /scripts...
echo.

move /Y iniciar-sistema.bat scripts\ 2>nul
move /Y iniciar-con-tecnicos.bat scripts\ 2>nul
move /Y simular-tecnicos.bat scripts\ 2>nul
move /Y ayuda-tecnicos.bat scripts\ 2>nul
move /Y probar-sistema-completo.bat scripts\ 2>nul
move /Y inicializar-sistema-completo.bat scripts\ 2>nul

echo ✅ Scripts movidos
echo.

echo 🧹 Paso 4: Limpiando archivos temporales...
echo.

if exist "node_modules" (
    echo Limpiando node_modules...
    rmdir /s /q node_modules 2>nul
)

if exist "server\node_modules" (
    echo Limpiando server/node_modules...
    rmdir /s /q server\node_modules 2>nul
)

if exist "dist" (
    echo Limpiando dist...
    rmdir /s /q dist 2>nul
)

del /q *.log 2>nul
del /q server\*.log 2>nul

echo ✅ Archivos temporales eliminados
echo.

echo 🔒 Paso 5: Verificando .gitignore...
echo.

if exist ".gitignore" (
    echo ✅ .gitignore existe
) else (
    echo ⚠️  .gitignore no existe - creándolo...
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo dist/ >> .gitignore
    echo *.log >> .gitignore
)

echo.
echo 🔐 Paso 6: Protegiendo credenciales...
echo.

if exist "server\.env" (
    echo ⚠️  IMPORTANTE: Revisa server/.env y remueve credenciales reales
    echo    Crea un server/.env.example con valores de ejemplo
    pause
)

echo.
echo ═══════════════════════════════════════════════════════
echo.
echo ✅ PROYECTO PREPARADO PARA SUBIR
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Revisa server/.env y remueve credenciales
echo 2. Verifica que .gitignore esté correcto
echo 3. Inicializa Git:
echo    git init
echo    git add .
echo    git commit -m "Sistema ARIA completo"
echo.
echo 4. Crea repositorio en GitHub
echo 5. Sube el código:
echo    git remote add origin https://github.com/TU-USUARIO/sistema-aria.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ═══════════════════════════════════════════════════════
echo.
pause
