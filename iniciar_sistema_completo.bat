@echo off
echo ========================================
echo Sistema de Monitoreo Metro CDMX
echo ========================================
echo.
echo Iniciando servicios...
echo.

REM Iniciar API en una ventana separada
start "API Sensores" cmd /k "python api_sensores.py"
timeout /t 3 /nobreak >nul

REM Iniciar servidor web en otra ventana
start "Servidor Web" cmd /k "python server.py"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Servicios iniciados:
echo ========================================
echo.
echo [1] API de Sensores: http://localhost:5000
echo [2] Servidor Web:    http://localhost:3000
echo.
echo Dashboard disponible en:
echo http://localhost:3000/dashboard_v3.html
echo.
echo Presiona cualquier tecla para abrir el dashboard...
pause >nul

REM Abrir el dashboard en el navegador
start http://localhost:3000/dashboard_v3.html

echo.
echo Dashboard abierto en el navegador
echo.
echo Para detener los servicios, cierra las ventanas de:
echo - API Sensores
echo - Servidor Web
echo.
pause
