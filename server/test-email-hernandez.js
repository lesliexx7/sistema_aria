import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
    console.log('\n📧 Probando envío a hernandez.nava@gmail.com...\n');

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        console.log('✅ Transporter creado');
        console.log(`   Usuario: ${process.env.GMAIL_USER}\n`);

        console.log('🔍 Verificando conexión...');
        await transporter.verify();
        console.log('✅ Conexión exitosa\n');

        console.log('📤 Enviando correo de prueba...');
        const info = await transporter.sendMail({
            from: `"Sistema ARIA - Metro CDMX" <${process.env.GMAIL_USER}>`,
            to: 'hernandez.nava@gmail.com',
            subject: '✅ Configuración Actualizada - Sistema ARIA',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0;">🚇 Sistema ARIA</h1>
                        <p style="margin: 10px 0 0 0;">Metro de la Ciudad de México</p>
                    </div>
                    
                    <div style="padding: 30px; background-color: #f5f5f5;">
                        <h2 style="color: #333;">✅ Configuración Actualizada</h2>
                        
                        <p style="color: #666; line-height: 1.6;">
                            El sistema ARIA ha sido configurado exitosamente para enviar reportes de incidencias a este correo.
                        </p>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #667eea; margin-top: 0;">📧 Destinatario Configurado</h3>
                            <p style="color: #333; font-size: 18px; font-weight: bold;">
                                hernandez.nava@gmail.com
                            </p>
                        </div>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #667eea; margin-top: 0;">📋 Qué Recibirás</h3>
                            <ul style="color: #666; line-height: 1.8;">
                                <li>Reportes completos de incidencias</li>
                                <li>Información del técnico asignado</li>
                                <li>Diagnóstico y acciones realizadas</li>
                                <li>Impacto operacional</li>
                                <li>Ubicación con enlace a Google Maps</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                            <p style="margin: 0; color: #1976d2;">
                                <strong>📅 Fecha de configuración:</strong> ${new Date().toLocaleString('es-MX')}
                            </p>
                        </div>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                            Este es un correo de prueba del Sistema ARIA<br>
                            Análisis y Respuesta Inteligente de Averías
                        </p>
                    </div>
                </div>
            `,
            text: 'Configuración actualizada - Sistema ARIA. Destinatario: hernandez.nava@gmail.com'
        });

        console.log('✅ ¡Correo enviado exitosamente!\n');
        console.log('📊 Detalles:');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Destinatario: hernandez.nava@gmail.com\n`);
        console.log('💡 Revisa la bandeja de entrada de hernandez.nava@gmail.com\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testEmail();
