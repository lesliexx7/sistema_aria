@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     INICIAR SISTEMA ARIA CON TÉCNICOS DISPONIBLES     ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 🔧 Paso 1: Preparando técnicos...
echo.

cd server
node verificar-y-corregir-tecnicos.js

if errorlevel 1 (
    echo.
    echo ❌ Error al preparar técnicos
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════
echo.
echo ✅ Técnicos listos
echo.
echo 🚀 Paso 2: Iniciando servidor backend...
echo.
echo ⚠️  Se abrirá una nueva ventana para el servidor
echo ⚠️  NO CIERRES esa ventana
echo.
pause

start "ARIA Backend Server" cmd /k "cd server && npm start"

echo.
echo ⏳ Esperando 5 segundos para que el servidor inicie...
timeout /t 5 /nobreak >nul

echo.
echo 🚀 Paso 3: Iniciando frontend...
echo.
echo ⚠️  Se abrirá una nueva ventana para el frontend
echo ⚠️  NO CIERRES esa ventana
echo.
pause

start "ARIA Frontend" cmd /k "npm run dev"

echo.
echo ═══════════════════════════════════════════════════════
echo.
echo ✅ SISTEMA INICIADO
echo.
echo 📊 Estado:
echo    • Backend: http://localhost:3002
echo    • Frontend: http://localhost:5173
echo    • Técnicos: 8 disponibles
echo.
echo 💡 Abre tu navegador en: http://localhost:5173
echo.
echo ⚠️  Para detener el sistema:
echo    1. Cierra las ventanas del servidor y frontend
echo    2. O presiona Ctrl+C en cada ventana
echo.
echo ═══════════════════════════════════════════════════════
echo.
pause
