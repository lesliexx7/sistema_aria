import pool from './db.js';

/**
 * Diagnóstico completo del sistema de técnicos
 */

async function diagnosticoCompleto() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         DIAGNÓSTICO COMPLETO DEL SISTEMA              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const resultados = {
        bd: false,
        tablaTecnicos: false,
        tecnicosExisten: false,
        tecnicosDisponibles: false,
        tablaSensores: false,
        tablaEventos: false,
        apiKey: false
    };

    try {
        // 1. Verificar conexión a BD
        console.log('1️⃣ Verificando conexión a base de datos...');
        try {
            await pool.query('SELECT NOW()');
            console.log('   ✅ Conexión exitosa a PostgreSQL\n');
            resultados.bd = true;
        } catch (error) {
            console.log('   ❌ Error de conexión a PostgreSQL');
            console.log(`   Error: ${error.message}\n`);
            return resultados;
        }

        // 2. Verificar tabla tecnicos
        console.log('2️⃣ Verificando tabla de técnicos...');
        const tablaTecnicos = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'tecnicos'
            );
        `);

        if (tablaTecnicos.rows[0].exists) {
            console.log('   ✅ Tabla "tecnicos" existe\n');
            resultados.tablaTecnicos = true;

            // 3. Verificar técnicos
            console.log('3️⃣ Verificando técnicos en base de datos...');
            const countTecnicos = await pool.query('SELECT COUNT(*) FROM tecnicos');
            const total = parseInt(countTecnicos.rows[0].count);

            if (total > 0) {
                console.log(`   ✅ ${total} técnicos registrados\n`);
                resultados.tecnicosExisten = true;

                // 4. Verificar disponibilidad
                console.log('4️⃣ Verificando disponibilidad...');
                const disponibles = await pool.query(
                    'SELECT COUNT(*) FROM tecnicos WHERE disponible = true'
                );
                const numDisponibles = parseInt(disponibles.rows[0].count);

                console.log(`   📊 Disponibles: ${numDisponibles}/${total}`);

                if (numDisponibles > 0) {
                    console.log('   ✅ Hay técnicos disponibles\n');
                    resultados.tecnicosDisponibles = true;

                    // Mostrar detalle
                    const tecnicosDetalle = await pool.query(`
                        SELECT id, nombre, especialidad, disponible, experiencia
                        FROM tecnicos
                        ORDER BY disponible DESC, experiencia DESC
                        LIMIT 5
                    `);

                    console.log('   📋 Primeros 5 técnicos:');
                    tecnicosDetalle.rows.forEach(t => {
                        const estado = t.disponible ? '🟢' : '🔴';
                        console.log(`      ${estado} ${t.id} - ${t.nombre}`);
                        console.log(`         ${t.especialidad} (${t.experiencia} años)`);
                    });
                    console.log();
                } else {
                    console.log('   ⚠️  No hay técnicos disponibles');
                    console.log('   💡 Ejecuta: node verificar-y-corregir-tecnicos.js\n');
                }
            } else {
                console.log('   ⚠️  No hay técnicos registrados');
                console.log('   💡 Ejecuta: node crear-tabla-tecnicos.js\n');
            }
        } else {
            console.log('   ❌ Tabla "tecnicos" no existe');
            console.log('   💡 Ejecuta: node crear-tabla-tecnicos.js\n');
        }

        // 5. Verificar tabla sensores
        console.log('5️⃣ Verificando tabla de sensores...');
        const tablaSensores = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'sensores'
            );
        `);

        if (tablaSensores.rows[0].exists) {
            const countSensores = await pool.query('SELECT COUNT(*) FROM sensores');
            const numSensores = parseInt(countSensores.rows[0].count);
            console.log(`   ✅ Tabla "sensores" existe (${numSensores} sensores)\n`);
            resultados.tablaSensores = true;
        } else {
            console.log('   ⚠️  Tabla "sensores" no existe\n');
        }

        // 6. Verificar tabla eventos
        console.log('6️⃣ Verificando tabla de eventos...');
        const tablaEventos = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'evento'
            );
        `);

        if (tablaEventos.rows[0].exists) {
            const countEventos = await pool.query(
                'SELECT COUNT(*) FROM evento WHERE estampa_finalizacion IS NULL'
            );
            const numPendientes = parseInt(countEventos.rows[0].count);
            console.log(`   ✅ Tabla "evento" existe (${numPendientes} pendientes)\n`);
            resultados.tablaEventos = true;
        } else {
            console.log('   ⚠️  Tabla "evento" no existe\n');
        }

        // 7. Verificar API Key de Google Maps
        console.log('7️⃣ Verificando configuración...');
        try {
            const fs = await import('fs');
            const envContent = fs.readFileSync('.env', 'utf8');

            if (envContent.includes('GOOGLE_MAPS_API_KEY')) {
                console.log('   ✅ API Key de Google Maps configurada\n');
                resultados.apiKey = true;
            } else {
                console.log('   ⚠️  API Key de Google Maps no encontrada en .env\n');
            }
        } catch (error) {
            console.log('   ⚠️  No se pudo leer archivo .env\n');
        }

        // 8. Resumen final
        console.log('═'.repeat(60));
        console.log('\n📊 RESUMEN DEL DIAGNÓSTICO\n');

        const checks = [
            { nombre: 'Conexión a BD', estado: resultados.bd },
            { nombre: 'Tabla técnicos', estado: resultados.tablaTecnicos },
            { nombre: 'Técnicos registrados', estado: resultados.tecnicosExisten },
            { nombre: 'Técnicos disponibles', estado: resultados.tecnicosDisponibles },
            { nombre: 'Tabla sensores', estado: resultados.tablaSensores },
            { nombre: 'Tabla eventos', estado: resultados.tablaEventos },
            { nombre: 'API Key configurada', estado: resultados.apiKey }
        ];

        checks.forEach(check => {
            const icono = check.estado ? '✅' : '❌';
            console.log(`${icono} ${check.nombre}`);
        });

        const todosOk = Object.values(resultados).every(v => v === true);

        console.log('\n' + '═'.repeat(60));

        if (todosOk) {
            console.log('\n🎉 SISTEMA COMPLETAMENTE OPERATIVO\n');
            console.log('✅ Todos los componentes están funcionando correctamente');
            console.log('✅ El sistema está listo para asignar técnicos\n');
            console.log('🚀 Próximos pasos:');
            console.log('   1. Iniciar servidor: npm start');
            console.log('   2. Iniciar frontend: npm run dev');
            console.log('   3. Probar asignación en el navegador\n');
        } else {
            console.log('\n⚠️  SISTEMA REQUIERE ATENCIÓN\n');

            if (!resultados.bd) {
                console.log('❌ Problema crítico: No hay conexión a la base de datos');
                console.log('   💡 Verifica que PostgreSQL esté corriendo\n');
            }

            if (!resultados.tablaTecnicos || !resultados.tecnicosExisten) {
                console.log('❌ Problema: Tabla de técnicos no configurada');
                console.log('   💡 Ejecuta: node crear-tabla-tecnicos.js\n');
            }

            if (!resultados.tecnicosDisponibles) {
                console.log('⚠️  Advertencia: No hay técnicos disponibles');
                console.log('   💡 Ejecuta: node verificar-y-corregir-tecnicos.js\n');
            }

            if (!resultados.apiKey) {
                console.log('⚠️  Advertencia: API Key no configurada');
                console.log('   💡 El sistema funcionará con distancias aproximadas\n');
            }
        }

        return resultados;

    } catch (error) {
        console.error('\n❌ Error durante el diagnóstico:', error.message);
        return resultados;
    } finally {
        await pool.end();
    }
}

// Ejecutar diagnóstico
diagnosticoCompleto();
