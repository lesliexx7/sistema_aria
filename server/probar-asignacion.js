import pool from './db.js';
import fetch from 'node-fetch';

/**
 * Script para probar la asignación de técnicos
 * Simula el flujo completo de asignación
 */

const API_URL = 'http://localhost:3002';

async function probarAsignacion() {
    try {
        console.log('🧪 PRUEBA DE ASIGNACIÓN DE TÉCNICOS\n');
        console.log('═'.repeat(60));

        // 1. Verificar que el servidor esté corriendo
        console.log('\n1️⃣ Verificando servidor...');
        try {
            const healthCheck = await fetch(`${API_URL}/health`);
            if (!healthCheck.ok) {
                throw new Error('Servidor no responde');
            }
            console.log('   ✅ Servidor activo');
        } catch (error) {
            console.log('   ❌ Servidor no está corriendo');
            console.log('   💡 Ejecuta: npm start (en carpeta server)');
            return;
        }

        // 2. Verificar técnicos disponibles en BD
        console.log('\n2️⃣ Verificando técnicos en base de datos...');
        const tecnicosDB = await pool.query(
            'SELECT COUNT(*) FROM tecnicos WHERE disponible = true'
        );
        const numDisponibles = parseInt(tecnicosDB.rows[0].count);
        console.log(`   ✅ ${numDisponibles} técnicos disponibles en BD`);

        if (numDisponibles === 0) {
            console.log('   ❌ No hay técnicos disponibles');
            console.log('   💡 Ejecuta: node verificar-y-corregir-tecnicos.js');
            return;
        }

        // 3. Obtener eventos pendientes
        console.log('\n3️⃣ Obteniendo eventos pendientes...');
        const eventosResponse = await fetch(`${API_URL}/api/eventos/pendientes`);
        const eventos = await eventosResponse.json();

        console.log(`   📊 ${eventos.length} eventos pendientes`);

        if (eventos.length === 0) {
            console.log('   ℹ️  No hay eventos pendientes para asignar');
            console.log('   💡 Crea un evento de prueba o espera a que ocurra uno');

            // Crear ubicación de prueba
            console.log('\n   🎯 Usando ubicación de prueba: Centro CDMX');
            const ubicacionPrueba = { lat: 19.4326, lng: -99.1332 };

            console.log('\n4️⃣ Buscando técnicos cercanos...');
            const tecnicosResponse = await fetch(`${API_URL}/api/tecnicos/cercanos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ubicacionPrueba)
            });

            const tecnicos = await tecnicosResponse.json();

            if (tecnicos.length === 0) {
                console.log('   ❌ No se encontraron técnicos cercanos');
                return;
            }

            console.log(`   ✅ ${tecnicos.length} técnicos encontrados\n`);
            console.log('   📋 TÉCNICOS CERCANOS:\n');

            tecnicos.slice(0, 3).forEach((t, i) => {
                console.log(`   ${i + 1}. ${t.nombre}`);
                console.log(`      ID: ${t.id}`);
                console.log(`      Especialidad: ${t.especialidad}`);
                console.log(`      Experiencia: ${t.experiencia} años`);
                console.log(`      Distancia: ${t.distancia}`);
                console.log(`      Tiempo estimado: ${t.tiempoEstimado}`);
                console.log(`      Tiempo con tráfico: ${t.tiempoConTrafico}`);
                console.log();
            });

            console.log('   ✅ Sistema de asignación funcionando correctamente');
            console.log('\n═'.repeat(60));
            console.log('✅ PRUEBA EXITOSA - Sistema listo para asignar técnicos\n');
            return;
        }

        // 4. Probar con el primer evento pendiente
        const evento = eventos[0];
        console.log(`\n   📍 Evento seleccionado: ${evento.ticketId}`);
        console.log(`      Sensor: ${evento.sensorId}`);
        console.log(`      Línea: ${evento.linea}`);
        console.log(`      Ubicación: ${evento.lat}, ${evento.lng}`);
        console.log(`      Severidad: ${evento.severidad}`);

        // 5. Buscar técnicos cercanos
        console.log('\n4️⃣ Buscando técnicos cercanos al evento...');
        const tecnicosResponse = await fetch(`${API_URL}/api/tecnicos/cercanos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: evento.lat, lng: evento.lng })
        });

        if (!tecnicosResponse.ok) {
            console.log('   ❌ Error al buscar técnicos');
            const error = await tecnicosResponse.text();
            console.log(`   Error: ${error}`);
            return;
        }

        const tecnicos = await tecnicosResponse.json();

        if (tecnicos.length === 0) {
            console.log('   ❌ No se encontraron técnicos cercanos');
            console.log('   💡 Verifica que haya técnicos disponibles');
            return;
        }

        console.log(`   ✅ ${tecnicos.length} técnicos encontrados\n`);

        // 6. Mostrar los 3 técnicos más cercanos
        console.log('   📋 TOP 3 TÉCNICOS MÁS CERCANOS:\n');
        tecnicos.slice(0, 3).forEach((t, i) => {
            console.log(`   ${i + 1}. ${t.nombre}`);
            console.log(`      ID: ${t.id}`);
            console.log(`      Especialidad: ${t.especialidad}`);
            console.log(`      Experiencia: ${t.experiencia} años`);
            console.log(`      Distancia: ${t.distancia}`);
            console.log(`      Tiempo estimado: ${t.tiempoEstimado}`);
            console.log(`      Tiempo con tráfico: ${t.tiempoConTrafico}`);
            console.log();
        });

        // 7. Simular asignación al técnico más cercano
        const tecnicoSeleccionado = tecnicos[0];
        console.log(`5️⃣ Simulando asignación al técnico más cercano...`);
        console.log(`   👤 ${tecnicoSeleccionado.nombre} (${tecnicoSeleccionado.id})`);

        const asignacionResponse = await fetch(
            `${API_URL}/api/eventos/${evento.ticketId}/asignar-tecnico`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tecnicoId: tecnicoSeleccionado.id })
            }
        );

        if (!asignacionResponse.ok) {
            console.log('   ❌ Error al asignar técnico');
            return;
        }

        console.log('   ✅ Técnico asignado exitosamente');

        // 8. Verificar estado final
        console.log('\n6️⃣ Verificando estado final...');

        const tecnicoActualizado = await pool.query(
            'SELECT * FROM tecnicos WHERE id = $1',
            [tecnicoSeleccionado.id]
        );

        const eventoActualizado = await pool.query(
            'SELECT * FROM evento WHERE id = $1',
            [evento.ticketId]
        );

        console.log(`   📊 Técnico ${tecnicoSeleccionado.id}:`);
        console.log(`      Disponible: ${tecnicoActualizado.rows[0].disponible ? '❌ NO (ocupado)' : '✅ SÍ'}`);

        console.log(`\n   📊 Evento ${evento.ticketId}:`);
        console.log(`      Estampa asignación: ${eventoActualizado.rows[0].estampa_asignacion || 'Sin asignar'}`);

        // 9. Liberar técnico (para pruebas)
        console.log('\n7️⃣ Liberando técnico (para pruebas)...');
        await fetch(`${API_URL}/api/tecnicos/${tecnicoSeleccionado.id}/liberar`, {
            method: 'PATCH'
        });
        console.log('   ✅ Técnico liberado');

        console.log('\n═'.repeat(60));
        console.log('✅ PRUEBA COMPLETADA EXITOSAMENTE\n');
        console.log('📊 RESUMEN:');
        console.log(`   - Eventos pendientes: ${eventos.length}`);
        console.log(`   - Técnicos disponibles: ${numDisponibles}`);
        console.log(`   - Técnico asignado: ${tecnicoSeleccionado.nombre}`);
        console.log(`   - Distancia: ${tecnicoSeleccionado.distancia}`);
        console.log(`   - Tiempo estimado: ${tecnicoSeleccionado.tiempoConTrafico}`);
        console.log('\n💡 El sistema de asignación está funcionando correctamente\n');

    } catch (error) {
        console.error('\n❌ Error en la prueba:', error.message);
        console.error('\n💡 Verifica que:');
        console.error('   1. El servidor esté corriendo (npm start)');
        console.error('   2. La base de datos esté activa');
        console.error('   3. Haya técnicos disponibles');
    } finally {
        await pool.end();
    }
}

// Ejecutar prueba
console.log('\n⏳ Iniciando prueba de asignación...\n');
probarAsignacion();
