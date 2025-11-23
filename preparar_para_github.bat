@echo off
echo ========================================
echo Preparar Proyecto para GitHub
echo ========================================
echo.

REM Verificar si Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git no esta instalado
    echo.
    echo Descarga Git desde: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

echo [OK] Git esta instalado
echo.

REM Inicializar repositorio Git
if not exist .git (
    echo Inicializando repositorio Git...
    git init
    echo [OK] Repositorio inicializado
) else (
    echo [OK] Repositorio Git ya existe
)
echo.

REM Agregar archivos
echo Agregando archivos al repositorio...
git add .
echo [OK] Archivos agregados
echo.

REM Hacer commit
echo Haciendo commit...
git commit -m "Sistema de Monitoreo Metro CDMX - Version Final"
echo [OK] Commit realizado
echo.

echo ========================================
echo SIGUIENTE PASO
echo ========================================
echo.
echo 1. Ve a: https://github.com/new
echo 2. Nombre del repositorio: metro-cdmx
echo 3. Click en "Create repository"
echo 4. Copia el comando que GitHub te muestra
echo.
echo Ejemplo:
echo   git remote add origin https://github.com/TU-USUARIO/metro-cdmx.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo 5. Pega esos comandos en esta terminal
echo.
pause
