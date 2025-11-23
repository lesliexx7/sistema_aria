import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
    console.log('\n📧 Probando envío de correo...\n');

    try {
        // Crear transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        console.log('✅ Transporter creado');
        console.log(`   Usuario: ${process.env.GMAIL_USER}\n`);

        // Verificar conexión
        console.log('🔍 Verificando conexión...');
        await transporter.verify();
        console.log('✅ Conexión exitosa\n');

        // Enviar correo de prueba
        console.log('📤 Enviando correo de prueba...');
        const info = await transporter.sendMail({
            from: `"Sistema ARIA" <${process.env.GMAIL_USER}>`,
            to: process.env.EMAIL_DESTINATARIOS_DEFAULT,
            subject: '✅ Prueba de Correo - Sistema ARIA',
            html: `
                <h1>🎉 ¡Correo de Prueba Exitoso!</h1>
                <p>El sistema ARIA está configurado correctamente para enviar correos.</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Este es un correo de prueba del Sistema ARIA - Metro CDMX
                </p>
            `,
            text: 'Correo de prueba del Sistema ARIA'
        });

        console.log('✅ ¡Correo enviado exitosamente!\n');
        console.log('📊 Detalles:');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Destinatario: ${process.env.EMAIL_DESTINATARIOS_DEFAULT}\n`);
        console.log('💡 Revisa tu bandeja de entrada\n');

    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.message.includes('Invalid login')) {
            console.log('\n💡 La contraseña de aplicación parece incorrecta');
            console.log('   Genera una nueva en: https://myaccount.google.com/apppasswords\n');
        }
    }
}

testEmail();
