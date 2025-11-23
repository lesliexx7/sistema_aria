import pool from './db.js';

/**
 * Script rápido para verificar y corregir el estado de técnicos
 * Soluciona el problema de "no hay técnicos disponibles"
 */

async function verificarYCorregir() {
    try {
        console.log('🔍 Verificando estado de técnicos...\n');

        // 1. Verificar si existe la tabla
        const tablaExiste = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'tecnicos'
            );
        `);

        if (!tablaExiste.rows[0].exists) {
            console.log('❌ La tabla "tecnicos" no existe');
            console.log('💡 Ejecuta: node crear-tabla-tecnicos.js\n');
            return;
        }

        // 2. Contar técnicos
        const totalTecnicos = await pool.query('SELECT COUNT(*) FROM tecnicos');
        const total = parseInt(totalTecnicos.rows[0].count);

        console.log(`📊 Total de técnicos en BD: ${total}`);

        if (total === 0) {
            console.log('❌ No hay técnicos en la base de datos');
            console.log('💡 Ejecuta: node crear-tabla-tecnicos.js\n');
            return;
        }

        // 3. Verificar disponibilidad
        const disponibles = await pool.query('SELECT COUNT(*) FROM tecnicos WHERE disponible = true');
        const numDisponibles = parseInt(disponibles.rows[0].count);

        console.log(`✅ Técnicos disponibles: ${numDisponibles}`);
        console.log(`❌ Técnicos ocupados: ${total - numDisponibles}\n`);

        // 4. Si no hay disponibles, corregir
        if (numDisponibles === 0) {
            console.log('⚠️  PROBLEMA DETECTADO: No hay técnicos disponibles\n');
            console.log('🔧 Aplicando corrección automática...\n');

            // Liberar todos los técnicos
            await pool.query('UPDATE tecnicos SET disponible = true, fecha_actualizacion = NOW()');

            console.log('✅ Todos los técnicos han sido liberados\n');
        }

        // 5. Mostrar estado final
        const tecnicosFinales = await pool.query(`
            SELECT id, nombre, especialidad, disponible, 
                   lat, lon, experiencia
            FROM tecnicos 
            ORDER BY disponible DESC, experiencia DESC
        `);

        console.log('📋 ESTADO ACTUAL DE TÉCNICOS:\n');
        console.log('═'.repeat(70));

        tecnicosFinales.rows.forEach(t => {
            const estado = t.disponible ? '🟢 DISPONIBLE' : '🔴 OCUPADO';
            console.log(`\n${estado}`);
            console.log(`ID: ${t.id}`);
            console.log(`Nombre: ${t.nombre}`);
            console.log(`Especialidad: ${t.especialidad}`);
            console.log(`Experiencia: ${t.experiencia} años`);
            console.log(`Ubicación: ${t.lat}, ${t.lon}`);
        });

        console.log('\n' + '═'.repeat(70));

        // 6. Resumen final
        const resumenFinal = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN disponible = true THEN 1 ELSE 0 END) as disponibles,
                SUM(CASE WHEN disponible = false THEN 1 ELSE 0 END) as ocupados
            FROM tecnicos
        `);

        const r = resumenFinal.rows[0];
        console.log('\n📊 RESUMEN:');
        console.log(`   Total: ${r.total} técnicos`);
        console.log(`   🟢 Disponibles: ${r.disponibles}`);
        console.log(`   🔴 Ocupados: ${r.ocupados}`);

        // 7. Verificar especialidades
        const especialidades = await pool.query(`
            SELECT especialidad, COUNT(*) as cantidad,
                   SUM(CASE WHEN disponible = true THEN 1 ELSE 0 END) as disponibles
            FROM tecnicos
            GROUP BY especialidad
            ORDER BY cantidad DESC
        `);

        console.log('\n🎯 ESPECIALIDADES:');
        especialidades.rows.forEach(e => {
            console.log(`   ${e.especialidad}: ${e.disponibles}/${e.cantidad} disponibles`);
        });

        // 8. Recomendaciones
        console.log('\n💡 RECOMENDACIONES:');

        if (parseInt(r.disponibles) === parseInt(r.total)) {
            console.log('   ✅ Sistema listo para asignar técnicos');
            console.log('   ✅ Todos los técnicos están disponibles');
        } else if (parseInt(r.disponibles) > 0) {
            console.log(`   ⚠️  Solo ${r.disponibles} de ${r.total} técnicos disponibles`);
            console.log('   💡 Considera liberar técnicos ocupados si es necesario');
        } else {
            console.log('   ❌ No hay técnicos disponibles');
            console.log('   💡 Ejecuta este script nuevamente para corregir');
        }

        console.log('\n🚀 Para simular diferentes escenarios:');
        console.log('   node simular-escenarios.js\n');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Ejecutar verificación
verificarYCorregir();
