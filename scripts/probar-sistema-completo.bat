@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║         PRUEBA COMPLETA DEL SISTEMA ARIA              ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo 1️⃣ Verificando PostgreSQL...
echo.
psql -U postgres -d aria_db -c "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL no está corriendo o no se puede conectar
    echo 💡 Inicia PostgreSQL primero
    echo.
    pause
    exit /b 1
) else (
    echo ✅ PostgreSQL está corriendo
)

echo.
echo 2️⃣ Verificando base de datos...
echo.
cd server
node -e "import('./db.js').then(m => m.default.query('SELECT 1').then(() => { console.log('✅ Conexión a BD exitosa'); process.exit(0); }).catch(e => { console.log('❌ Error de conexión:', e.message); process.exit(1); }))" 2>nul
if errorlevel 1 (
    echo ❌ No se puede conectar a la base de datos
    cd ..
    pause
    exit /b 1
)

echo.
echo 3️⃣ Verificando técnicos...
echo.
node diagnostico-completo.js
cd ..

echo.
echo ═══════════════════════════════════════════════════════
echo.
echo 4️⃣ ¿Deseas iniciar el sistema ahora? (S/N)
set /p iniciar="Respuesta: "

if /i "%iniciar%"=="S" (
    echo.
    echo 🚀 Iniciando sistema...
    call iniciar-con-tecnicos.bat
) else (
    echo.
    echo 👋 Prueba completada
    echo.
    echo 💡 Para iniciar el sistema ejecuta:
    echo    iniciar-con-tecnicos.bat
    echo.
)

pause
