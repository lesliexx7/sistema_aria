import { enviarReportePorCorreo, verificarConfiguracionCorreo } from './email-service.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pregunta(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function probarEnvioCorreo() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         PRUEBA DE ENVÍO DE CORREOS - ARIA             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
        // 1. Verificar configuración
        console.log('1️⃣ Verificando configuración de correo...\n');

        const configurado = await verificarConfiguracionCorreo();

        if (!configurado) {
            console.log('❌ No hay configuración de correo disponible\n');
            console.log('💡 Configura las variables en server/.env:');
            console.log('   GMAIL_USER=tu-correo@gmail.com');
            console.log('   GMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion\n');
            console.log('📖 Lee CONFIGURACION_CORREO.md para más detalles\n');
            rl.close();
            return;
        }

        console.log('✅ Configuración de correo OK\n');

        // 2. Solicitar correo de destino
        console.log('2️⃣ Configuración de prueba\n');

        const destinatario = await pregunta('Correo del destinatario: ');

        if (!destinatario || !destinatario.includes('@')) {
            console.log('❌ Correo inválido\n');
            rl.close();
            return;
        }

        // 3. Crear reporte de prueba
        console.log('\n3️⃣ Generando reporte de prueba...\n');

        const reportePrueba = {
            numeroOT: `OT-PRUEBA-${Date.now()}`,
            fechaDeteccion: new Date().toLocaleString('es-MX'),
            lineaMetro: 'Línea 1 - Observatorio / Pantitlán',
            severidad: 'medio',
            ubicacionFallo: 'Estación Balderas - Entre andenes',
            viaAfectada: 'Vía 1 (Ascendente)',
            puntoKilometrico: 'PK 5.2',
            coordenadasLat: 19.4277,
            coordenadasLng: -99.1494,
            tipoSensor: 'Contador de Ejes',
            idActivo: 'L1-CE-052',
            mensajeAlarma: 'Sensor X - Time-Out de Comunicación',
            sintomaOperacional: 'Pérdida de comunicación con el sensor de conteo',
            tecnicoNombre: 'Carlos Mendoza García',
            tecnicoId: 'TEC-2847',
            tecnicoEspecialidad: 'Señalización y Control',
            horaLlegada: new Date(Date.now() - 1800000).toLocaleString('es-MX'),
            diagnosticoPreliminar: 'Se detectó falla en el módulo de comunicación del contador de ejes. El sensor no responde a los comandos de diagnóstico. Se procede a verificar conexiones y alimentación eléctrica.',
            accionesIntervencion: `1. Verificación de alimentación eléctrica - OK
2. Revisión de conexiones físicas - Detectada conexión floja en terminal J3
3. Reapriete de conexiones
4. Limpieza de contactos
5. Prueba de comunicación - Exitosa
6. Verificación de parámetros - OK`,
            componenteReemplazado: 'Ninguno',
            componenteNuevoId: null,
            pruebasRealizadas: `✓ Test de paso de tren exitoso
✓ Lectura de parámetros OK
✓ Comunicación con centro de control OK
✓ Señalización operando correctamente`,
            notasPruebas: 'Se realizaron 3 pruebas de paso de tren con resultados satisfactorios. El sensor responde correctamente a todos los comandos.',
            tiempoTotalFormato: '00:45:30',
            impactoMinutos: 15,
            trenesAfectados: 3,
            observaciones: 'Se recomienda revisar todas las conexiones del gabinete durante el próximo mantenimiento preventivo. La conexión floja pudo haberse causado por vibración.',
            recomendaciones: `1. Incluir revisión de apriete de conexiones en checklist de mantenimiento preventivo
2. Considerar uso de conectores con seguro mecánico
3. Programar inspección de gabinetes en esta zona (alta vibración)`,
            fotosAdjuntas: [],
            reporteTexto: 'Reporte de prueba del sistema ARIA'
        };

        console.log('📋 Reporte generado:');
        console.log(`   OT: ${reportePrueba.numeroOT}`);
        console.log(`   Línea: ${reportePrueba.lineaMetro}`);
        console.log(`   Severidad: ${reportePrueba.severidad}`);
        console.log(`   Técnico: ${reportePrueba.tecnicoNombre}\n`);

        // 4. Confirmar envío
        const confirmar = await pregunta('¿Enviar correo de prueba? (s/n): ');

        if (confirmar.toLowerCase() !== 's') {
            console.log('\n❌ Envío cancelado\n');
            rl.close();
            return;
        }

        // 5. Enviar correo
        console.log('\n4️⃣ Enviando correo...\n');
        console.log('⏳ Por favor espera...\n');

        const resultado = await enviarReportePorCorreo(reportePrueba, destinatario);

        // 6. Mostrar resultado
        console.log('═'.repeat(60));
        console.log('\n✅ ¡CORREO ENVIADO EXITOSAMENTE!\n');
        console.log('📊 Detalles:');
        console.log(`   Destinatario: ${resultado.destinatarios}`);
        console.log(`   Message ID: ${resultado.messageId}`);
        console.log(`   Fecha: ${new Date().toLocaleString('es-MX')}\n`);
        console.log('═'.repeat(60));
        console.log('\n💡 Revisa tu bandeja de entrada');
        console.log('   Si no lo ves, revisa la carpeta de spam\n');

    } catch (error) {
        console.error('\n❌ Error al enviar correo:\n');
        console.error(`   ${error.message}\n`);

        if (error.message.includes('Invalid login')) {
            console.log('💡 Posibles causas:');
            console.log('   1. Contraseña incorrecta');
            console.log('   2. No estás usando contraseña de aplicación');
            console.log('   3. Verificación en 2 pasos no activada\n');
            console.log('📖 Lee CONFIGURACION_CORREO.md para configurar correctamente\n');
        }
    } finally {
        rl.close();
    }
}

// Ejecutar prueba
probarEnvioCorreo();
