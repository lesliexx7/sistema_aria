import pool from './db.js';

/**
 * Script para simular técnicos disponibles en turno
 * Útil para probar el sistema de asignación de técnicos
 */

// Ubicaciones estratégicas en CDMX (cerca de líneas del metro)
const UBICACIONES_ESTRATEGICAS = [
    { nombre: 'Zócalo', lat: 19.4326, lon: -99.1332 },
    { nombre: 'Polanco', lat: 19.4326, lon: -99.1947 },
    { nombre: 'Insurgentes', lat: 19.4284, lon: -99.1677 },
    { nombre: 'Pantitlán', lat: 19.4154, lon: -99.0721 },
    { nombre: 'Tacubaya', lat: 19.4019, lon: -99.1871 },
    { nombre: 'Indios Verdes', lat: 19.4969, lon: -99.1271 },
    { nombre: 'Universidad', lat: 19.3244, lon: -99.1739 },
    { nombre: 'Constitución de 1917', lat: 19.3460, lon: -99.0640 }
];

async function simularTecnicosDisponibles() {
    try {
        console.log('🔧 Iniciando simulación de técnicos...\n');

        // 1. Verificar técnicos existentes
        const tecnicosExistentes = await pool.query('SELECT * FROM tecnicos ORDER BY id');
        console.log(`📊 Técnicos en base de datos: ${tecnicosExistentes.rows.length}`);

        if (tecnicosExistentes.rows.length === 0) {
            console.log('⚠️  No hay técnicos en la base de datos');
            console.log('💡 Ejecuta primero: node crear-tabla-tecnicos.js\n');
            return;
        }

        // 2. Mostrar estado actual
        console.log('\n📋 Estado actual de técnicos:');
        tecnicosExistentes.rows.forEach(t => {
            console.log(`   ${t.id} - ${t.nombre}`);
            console.log(`      Disponible: ${t.disponible ? '✅ SÍ' : '❌ NO'}`);
            console.log(`      Ubicación: ${t.lat}, ${t.lon}`);
            console.log(`      Especialidad: ${t.especialidad}\n`);
        });

        // 3. Poner todos los técnicos disponibles
        console.log('🔄 Actualizando disponibilidad de técnicos...');
        await pool.query('UPDATE tecnicos SET disponible = true');
        console.log('✅ Todos los técnicos ahora están disponibles\n');

        // 4. Redistribuir técnicos en ubicaciones estratégicas
        console.log('📍 Redistribuyendo técnicos en ubicaciones estratégicas...');
        const tecnicos = tecnicosExistentes.rows;

        for (let i = 0; i < tecnicos.length; i++) {
            const ubicacion = UBICACIONES_ESTRATEGICAS[i % UBICACIONES_ESTRATEGICAS.length];

            // Agregar pequeña variación aleatoria para simular movimiento
            const latVariacion = (Math.random() - 0.5) * 0.01; // ~1km de variación
            const lonVariacion = (Math.random() - 0.5) * 0.01;

            const nuevaLat = ubicacion.lat + latVariacion;
            const nuevaLon = ubicacion.lon + lonVariacion;

            await pool.query(
                'UPDATE tecnicos SET lat = $1, lon = $2, fecha_actualizacion = NOW() WHERE id = $3',
                [nuevaLat, nuevaLon, tecnicos[i].id]
            );

            console.log(`   ${tecnicos[i].id} → ${ubicacion.nombre} (${nuevaLat.toFixed(4)}, ${nuevaLon.toFixed(4)})`);
        }

        // 5. Mostrar resumen final
        console.log('\n✅ Simulación completada exitosamente!\n');

        const tecnicosActualizados = await pool.query(
            'SELECT * FROM tecnicos WHERE disponible = true ORDER BY id'
        );

        console.log('📊 RESUMEN:');
        console.log(`   Total de técnicos: ${tecnicosActualizados.rows.length}`);
        console.log(`   Técnicos disponibles: ${tecnicosActualizados.rows.length}`);
        console.log(`   Técnicos en turno: ${tecnicosActualizados.rows.length}`);

        console.log('\n🎯 Especialidades disponibles:');
        const especialidades = {};
        tecnicosActualizados.rows.forEach(t => {
            especialidades[t.especialidad] = (especialidades[t.especialidad] || 0) + 1;
        });
        Object.entries(especialidades).forEach(([esp, count]) => {
            console.log(`   - ${esp}: ${count} técnico(s)`);
        });

        console.log('\n💡 Ahora puedes probar el sistema de asignación de técnicos');
        console.log('   Los técnicos están distribuidos estratégicamente en CDMX\n');

    } catch (error) {
        console.error('❌ Error en simulación:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Ejecutar simulación
simularTecnicosDisponibles();
