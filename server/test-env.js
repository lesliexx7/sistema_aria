import dotenv from 'dotenv';

dotenv.config();

console.log('\n🔍 Verificando variables de entorno:\n');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***' + process.env.GMAIL_APP_PASSWORD.slice(-4) : 'NO DEFINIDA');
console.log('EMAIL_DESTINATARIOS_DEFAULT:', process.env.EMAIL_DESTINATARIOS_DEFAULT);
console.log('\n');

if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    console.log('✅ Variables configuradas correctamente\n');
} else {
    console.log('❌ Faltan variables de configuración\n');
}
