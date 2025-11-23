@echo off
echo ========================================
echo   Sistema ARIA - Metro CDMX
echo   Iniciando Backend y Frontend
echo ========================================
echo.

echo [1/3] Instalando dependencias del servidor...
cd server
call npm install
echo.

echo [2/3] Probando conexion a la base de datos...
call npm run test-db
echo.

echo [3/3] Iniciando servidor backend...
echo El servidor estara disponible en http://localhost:3002
echo.
echo IMPORTANTE: Despues de que el servidor inicie,
echo abre otra terminal y ejecuta: npm run dev
echo para iniciar el frontend en http://localhost:5173
echo.
call npm run dev
