// Ejemplo de cómo integrar el envío de correos en ARIAApp.jsx

import { enviarReportePorCorreoDirecto } from './src/services/api.js';
import { useState } from 'react';

// ============================================
// OPCIÓN 1: Botón Simple con Prompt
// ============================================

const EnviarCorreoSimple = ({ reporteData }) => {
    const handleEnviarCorreo = async () => {
        try {
            const destinatario = prompt(
                'Ingresa el correo del destinatario:',
                'reportes@empresa.com'
            );

            if (!destinatario) return;

            await enviarReportePorCorreoDirecto(reporteData, destinatario);
            alert('✅ Reporte enviado exitosamente');
        } catch (error) {
            alert('❌ Error al enviar: ' + error.message);
        }
    };

    return (
        <button
            onClick={handleEnviarCorreo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
            <span>📧</span>
            Enviar por Correo
        </button>
    );
};

// ============================================
// OPCIÓN 2: Modal Completo con Múltiples Destinatarios
// ============================================

const EnviarCorreoModal = ({ reporteData, onClose }) => {
    const [destinatarios, setDestinatarios] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    const handleEnviar = async () => {
        try {
            setEnviando(true);
            setError(null);

            // Convertir string a array
            const lista = destinatarios
                .split(',')
                .map(e => e.trim())
                .filter(e => e);

            if (lista.length === 0) {
                setError('Ingresa al menos un destinatario');
                return;
            }

            // Enviar correo
            await enviarReportePorCorreoDirecto(reporteData, lista);

            alert(`✅ Reporte enviado a ${lista.length} destinatario(s)`);
            onClose();
        } catch (error) {
            setError(error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                    📧 Enviar Reporte por Correo
                </h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destinatarios
                    </label>
                    <input
                        type="text"
                        value={destinatarios}
                        onChange={(e) => setDestinatarios(e.target.value)}
                        placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        disabled={enviando}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Separa múltiples correos con comas
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        ❌ {error}
                    </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-1">
                        <strong>Reporte:</strong> {reporteData.numeroOT}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <strong>Línea:</strong> {reporteData.lineaMetro}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Severidad:</strong> {reporteData.severidad}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleEnviar}
                        disabled={enviando}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        {enviando ? '⏳ Enviando...' : '📧 Enviar'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={enviando}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// OPCIÓN 3: Envío Automático al Finalizar
// ============================================

const FinalizarReporteConCorreo = async (reporteData) => {
    try {
        // 1. Guardar reporte en BD
        const resultado = await guardarReporteFinal(reporteData);
        console.log('Reporte guardado:', resultado.id);

        // 2. Enviar por correo automáticamente
        const destinatarios = [
            'supervisor@empresa.com',
            'reportes@empresa.com'
        ];

        await enviarReportePorCorreoDirecto(reporteData, destinatarios);
        console.log('Correo enviado automáticamente');

        // 3. Mostrar confirmación
        alert('✅ Reporte guardado y enviado por correo');

    } catch (error) {
        console.error('Error:', error);
        alert('⚠️ Reporte guardado pero no se pudo enviar por correo');
    }
};

// ============================================
// OPCIÓN 4: Integración en ARIAApp.jsx
// ============================================

// Agregar estado para el modal
const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);

// En la sección de botones del reporte final
<div className="flex gap-3">
    {/* Botón existente de guardar */}
    <button onClick={handleGuardarReporte}>
        💾 Guardar Reporte
    </button>

    {/* NUEVO: Botón de enviar por correo */}
    <button
        onClick={() => setMostrarModalCorreo(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
        <span>📧</span>
        Enviar por Correo
    </button>
</div>

// Al final del componente, antes del cierre
{
    mostrarModalCorreo && (
        <EnviarCorreoModal
            reporteData={autoData}
            onClose={() => setMostrarModalCorreo(false)}
        />
    )
}

// ============================================
// OPCIÓN 5: Botón con Destinatarios Predefinidos
// ============================================

const EnviarCorreoRapido = ({ reporteData }) => {
    const destinatariosPredefinidos = [
        { label: 'Supervisor', email: 'supervisor@empresa.com' },
        { label: 'Reportes', email: 'reportes@empresa.com' },
        { label: 'Mantenimiento', email: 'mantenimiento@empresa.com' }
    ];

    const [enviando, setEnviando] = useState(false);

    const handleEnviar = async (destinatario) => {
        try {
            setEnviando(true);
            await enviarReportePorCorreoDirecto(reporteData, destinatario.email);
            alert(`✅ Enviado a ${destinatario.label}`);
        } catch (error) {
            alert('❌ Error: ' + error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Enviar a:</p>
            <div className="flex gap-2">
                {destinatariosPredefinidos.map((dest) => (
                    <button
                        key={dest.email}
                        onClick={() => handleEnviar(dest)}
                        disabled={enviando}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition disabled:opacity-50"
                    >
                        📧 {dest.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ============================================
// OPCIÓN 6: Verificar Configuración al Iniciar
// ============================================

import { verificarConfiguracionCorreo } from './src/services/api.js';

// En useEffect al iniciar la app
useEffect(() => {
    const verificarCorreo = async () => {
        try {
            const resultado = await verificarConfiguracionCorreo();
            if (resultado.configurado) {
                console.log('✅ Correo configurado correctamente');
            } else {
                console.warn('⚠️ Correo no configurado');
            }
        } catch (error) {
            console.error('Error al verificar correo:', error);
        }
    };

    verificarCorreo();
}, []);

// ============================================
// EJEMPLO COMPLETO DE USO
// ============================================

export default function ARIAAppConCorreo() {
    const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
    const [reporteData, setReporteData] = useState(null);

    const handleFinalizarReporte = async () => {
        try {
            // 1. Preparar datos del reporte
            const reporte = {
                numeroOT: autoData.reporte.numeroOT,
                fechaDeteccion: autoData.reporte.fechaHoraDeteccion,
                lineaMetro: autoData.ubicacion.lineaMetro,
                severidad: severity,
                // ... resto de datos
            };

            // 2. Guardar en BD
            await guardarReporteFinal(reporte);

            // 3. Mostrar modal para enviar por correo
            setReporteData(reporte);
            setMostrarModalCorreo(true);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {/* Tu componente existente */}

            {/* Botón de finalizar con opción de correo */}
            <button onClick={handleFinalizarReporte}>
                ✅ Finalizar y Enviar
            </button>

            {/* Modal de correo */}
            {mostrarModalCorreo && (
                <EnviarCorreoModal
                    reporteData={reporteData}
                    onClose={() => setMostrarModalCorreo(false)}
                />
            )}
        </div>
    );
}

// ============================================
// NOTAS DE IMPLEMENTACIÓN
// ============================================

/*
1. Importa las funciones necesarias:
   import { enviarReportePorCorreoDirecto } from './src/services/api.js';

2. Agrega el estado para el modal:
   const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);

3. Crea el botón donde quieras:
   <button onClick={() => setMostrarModalCorreo(true)}>
       📧 Enviar por Correo
   </button>

4. Agrega el modal al final del componente:
   {mostrarModalCorreo && (
       <EnviarCorreoModal
           reporteData={autoData}
           onClose={() => setMostrarModalCorreo(false)}
       />
   )}

5. Configura las variables de entorno en server/.env:
   GMAIL_USER=tu-correo@gmail.com
   GMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion

6. Reinicia el servidor:
   Get-Process -Name node | Stop-Process -Force
   cd server && npm start

7. ¡Listo! Prueba enviando un reporte
*/
