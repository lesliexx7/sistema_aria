@echo off
echo ========================================
echo   Sistema ARIA - Inicializacion Completa
echo   Metro CDMX - Siemens Mobility
echo ========================================
echo.

echo [1/5] Instalando dependencias del servidor...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)
echo.

echo [2/5] Probando conexion a la base de datos...
call node test-db.js
if %errorlevel% neq 0 (
    echo ERROR: No se pudo conectar a la base de datos
    pause
    exit /b 1
)
echo.

echo [3/5] Verificando columna tiempo_atencion_minutos...
call node verificar-tiempo-atencion.js
echo.

echo [4/5] Creando tabla de tecnicos...
call node crear-tabla-tecnicos.js
if %errorlevel% neq 0 (
    echo ERROR: Fallo al crear tabla de tecnicos
    pause
    exit /b 1
)
echo.

echo [5/5] Verificando estructura completa...
call node verificar-tablas-completas.js
echo.

echo ========================================
echo   SISTEMA LISTO PARA INICIAR
echo ========================================
echo.
echo Para iniciar el sistema:
echo.
echo 1. Backend (esta terminal):
echo    cd server
echo    npm run dev
echo.
echo 2. Frontend (nueva terminal):
echo    npm run dev
echo.
echo ========================================
pause
