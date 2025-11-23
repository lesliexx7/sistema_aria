import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Servicio de envío de correos electrónicos
 * Usa Gmail API o SMTP según configuración
 */

// Configurar transporter de nodemailer
const createTransporter = () => {
    // Opción 1: Gmail con contraseña de aplicación (más fácil)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
    }

    // Opción 2: SMTP genérico
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    throw new Error('No hay configuración de correo disponible');
};

/**
 * Generar HTML del reporte
 */
const generarHTMLReporte = (reporte) => {
    const severidadColor = {
        'critico': '#dc2626',
        'alto': '#ea580c',
        'medio': '#eab308',
        'bajo': '#16a34a'
    };

    const color = severidadColor[reporte.severidad] || '#6b7280';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Incidencia - ${reporte.numeroOT}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child {
            border-bottom: none;
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .section-title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            background-color: ${color};
            margin-right: 10px;
            border-radius: 2px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .info-item {
            background-color: #f9fafb;
            padding: 12px;
            border-radius: 6px;
        }
        .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 14px;
            color: #1f2937;
            font-weight: 500;
        }
        .severity-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: white;
            background-color: ${color};
        }
        .full-width {
            grid-column: 1 / -1;
        }
        .text-content {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .map-link {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
        }
        .map-link:hover {
            background-color: #2563eb;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚇 Reporte de Incidencia Metro CDMX</h1>
            <p>Sistema ARIA - Análisis y Respuesta Inteligente de Averías</p>
        </div>

        <div class="content">
            <!-- Información General -->
            <div class="section">
                <div class="section-title">📋 Información General</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Número de OT</div>
                        <div class="info-value">${reporte.numeroOT}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Fecha de Detección</div>
                        <div class="info-value">${reporte.fechaDeteccion}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Línea</div>
                        <div class="info-value">${reporte.lineaMetro}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Severidad</div>
                        <div class="info-value">
                            <span class="severity-badge">${reporte.severidad}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ubicación -->
            <div class="section">
                <div class="section-title">📍 Ubicación del Fallo</div>
                <div class="info-grid">
                    <div class="info-item full-width">
                        <div class="info-label">Ubicación</div>
                        <div class="info-value">${reporte.ubicacionFallo}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Vía Afectada</div>
                        <div class="info-value">${reporte.viaAfectada}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Punto Kilométrico</div>
                        <div class="info-value">${reporte.puntoKilometrico}</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">Coordenadas</div>
                        <div class="info-value">
                            ${reporte.coordenadasLat}, ${reporte.coordenadasLng}
                            <a href="https://www.google.com/maps?q=${reporte.coordenadasLat},${reporte.coordenadasLng}" 
                               class="map-link" target="_blank">
                                📍 Ver en Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activo Afectado -->
            <div class="section">
                <div class="section-title">⚙️ Activo Afectado</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Tipo de Sensor</div>
                        <div class="info-value">${reporte.tipoSensor}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">ID del Activo</div>
                        <div class="info-value">${reporte.idActivo}</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">Mensaje de Alarma</div>
                        <div class="info-value">${reporte.mensajeAlarma}</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">Síntoma Operacional</div>
                        <div class="info-value">${reporte.sintomaOperacional}</div>
                    </div>
                </div>
            </div>

            <!-- Técnico Asignado -->
            <div class="section">
                <div class="section-title">👤 Técnico Asignado</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nombre</div>
                        <div class="info-value">${reporte.tecnicoNombre}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">ID Empleado</div>
                        <div class="info-value">${reporte.tecnicoId}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Especialidad</div>
                        <div class="info-value">${reporte.tecnicoEspecialidad}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Hora de Llegada</div>
                        <div class="info-value">${reporte.horaLlegada}</div>
                    </div>
                </div>
            </div>

            <!-- Diagnóstico y Acciones -->
            <div class="section">
                <div class="section-title">🔧 Diagnóstico y Acciones</div>
                <div class="info-item full-width">
                    <div class="info-label">Diagnóstico Preliminar</div>
                    <div class="text-content">${reporte.diagnosticoPreliminar}</div>
                </div>
                <div class="info-item full-width" style="margin-top: 15px;">
                    <div class="info-label">Acciones de Intervención</div>
                    <div class="text-content">${reporte.accionesIntervencion}</div>
                </div>
            </div>

            <!-- Componentes Reemplazados -->
            ${reporte.componenteReemplazado ? `
            <div class="section">
                <div class="section-title">🔄 Componentes Reemplazados</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Componente</div>
                        <div class="info-value">${reporte.componenteReemplazado}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">ID Nuevo Componente</div>
                        <div class="info-value">${reporte.componenteNuevoId || 'N/A'}</div>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Pruebas Realizadas -->
            <div class="section">
                <div class="section-title">✅ Pruebas Realizadas</div>
                <div class="info-item full-width">
                    <div class="info-label">Pruebas</div>
                    <div class="text-content">${reporte.pruebasRealizadas}</div>
                </div>
                ${reporte.notasPruebas ? `
                <div class="info-item full-width" style="margin-top: 15px;">
                    <div class="info-label">Notas de Pruebas</div>
                    <div class="text-content">${reporte.notasPruebas}</div>
                </div>
                ` : ''}
            </div>

            <!-- Impacto Operacional -->
            <div class="section">
                <div class="section-title">📊 Impacto Operacional</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Tiempo Total de Atención</div>
                        <div class="info-value">${reporte.tiempoTotalFormato}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Impacto en Minutos</div>
                        <div class="info-value">${reporte.impactoMinutos} min</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Trenes Afectados</div>
                        <div class="info-value">${reporte.trenesAfectados}</div>
                    </div>
                </div>
            </div>

            <!-- Observaciones y Recomendaciones -->
            ${reporte.observaciones ? `
            <div class="section">
                <div class="section-title">📝 Observaciones</div>
                <div class="text-content">${reporte.observaciones}</div>
            </div>
            ` : ''}

            ${reporte.recomendaciones ? `
            <div class="section">
                <div class="section-title">💡 Recomendaciones</div>
                <div class="text-content">${reporte.recomendaciones}</div>
            </div>
            ` : ''}

            <!-- Fotos Adjuntas -->
            ${reporte.fotosAdjuntas && reporte.fotosAdjuntas.length > 0 ? `
            <div class="section">
                <div class="section-title">📷 Fotos Adjuntas</div>
                <div class="info-value">${reporte.fotosAdjuntas.length} foto(s) adjunta(s)</div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p><strong>Sistema ARIA</strong> - Análisis y Respuesta Inteligente de Averías</p>
            <p>Metro de la Ciudad de México</p>
            <p>Generado automáticamente el ${new Date().toLocaleString('es-MX')}</p>
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Enviar reporte por correo
 */
export const enviarReportePorCorreo = async (reporte, destinatarios) => {
    try {
        const transporter = createTransporter();

        // Convertir destinatarios a array si es string
        const listaDestinatarios = Array.isArray(destinatarios)
            ? destinatarios.join(', ')
            : destinatarios;

        const mailOptions = {
            from: `"Sistema ARIA - Metro CDMX" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
            to: listaDestinatarios,
            subject: `[${reporte.severidad.toUpperCase()}] Reporte de Incidencia - ${reporte.numeroOT} - ${reporte.lineaMetro}`,
            html: generarHTMLReporte(reporte),
            text: reporte.reporteTexto || `Reporte de incidencia ${reporte.numeroOT}`,
            // Adjuntar fotos si existen
            attachments: reporte.fotosAdjuntas && reporte.fotosAdjuntas.length > 0
                ? reporte.fotosAdjuntas.map((foto, index) => ({
                    filename: `foto_${index + 1}.jpg`,
                    path: foto
                }))
                : []
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Correo enviado exitosamente');
        console.log(`   ID del mensaje: ${info.messageId}`);
        console.log(`   Destinatarios: ${listaDestinatarios}`);

        return {
            success: true,
            messageId: info.messageId,
            destinatarios: listaDestinatarios
        };

    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        throw error;
    }
};

/**
 * Verificar configuración de correo
 */
export const verificarConfiguracionCorreo = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Configuración de correo verificada');
        return true;
    } catch (error) {
        console.error('❌ Error en configuración de correo:', error.message);
        return false;
    }
};
