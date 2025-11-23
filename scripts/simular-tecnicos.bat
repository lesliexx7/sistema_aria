@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        SIMULADOR DE TÉCNICOS - SISTEMA ARIA           ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Selecciona una opción:
echo.
echo 1. Verificar y corregir estado actual
echo 2. Simulación rápida (todos disponibles)
echo 3. Simulador interactivo (escenarios múltiples)
echo 4. Probar asignación de técnicos
echo 5. Salir
echo.
set /p opcion="Opción: "

if "%opcion%"=="1" (
    echo.
    echo 🔍 Verificando estado de técnicos...
    cd server
    node verificar-y-corregir-tecnicos.js
    cd ..
    goto fin
)

if "%opcion%"=="2" (
    echo.
    echo 🔧 Ejecutando simulación rápida...
    cd server
    node simular-tecnicos.js
    cd ..
    goto fin
)

if "%opcion%"=="3" (
    echo.
    echo 🎮 Iniciando simulador interactivo...
    cd server
    node simular-escenarios.js
    cd ..
    goto fin
)

if "%opcion%"=="4" (
    echo.
    echo 🧪 Probando asignación de técnicos...
    echo ⚠️  Asegúrate de que el servidor esté corriendo
    echo.
    cd server
    node probar-asignacion.js
    cd ..
    goto fin 
)

if "%opcion%"=="5" (
    echo.
    echo 👋 ¡Hasta luego!
    goto salir
)

echo.
echo ❌ Opción inválida
echo.

:fin
echo.
pause
goto salir

:salir
