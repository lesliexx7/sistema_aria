import pool from './db.js';

async function verificarSensores() {
    try {
        console.log('🔍 Verificando tabla sensores...\n');

        // Verificar si existe la tabla
        const checkTable = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'sensores'
        `);

        if (checkTable.rows.length === 0) {
            console.log('❌ La tabla sensores NO existe');
            await pool.end();
            return;
        }

        console.log('✅ La tabla sensores existe\n');

        // Mostrar estructura
        console.log('📋 Estructura de la tabla sensores:');
        const columns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'sensores'
            ORDER BY ordinal_position
        `);

        columns.rows.forEach(col => {
            console.log(`   ✓ ${col.column_name.padEnd(20)} ${col.data_type.padEnd(30)} (${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'})`);
        });

        // Contar sensores
        const count = await pool.query('SELECT COUNT(*) as total FROM sensores');
        console.log(`\n📊 Total de sensores: ${count.rows[0].total}`);

        // Mostrar sensores por línea
        console.log('\n📍 Sensores por línea:');
        const porLinea = await pool.query(`
            SELECT linea, COUNT(*) as cantidad
            FROM sensores
            GROUP BY linea
            ORDER BY linea
        `);

        porLinea.rows.forEach(row => {
            console.log(`   Línea ${row.linea}: ${row.cantidad} sensores`);
        });

        // Mostrar algunos sensores de ejemplo
        console.log('\n🔍 Sensores de ejemplo:');
        const ejemplos = await pool.query(`
            SELECT sensor_id, linea, lat, lon
            FROM sensores
            LIMIT 5
        `);

        ejemplos.rows.forEach(sensor => {
            console.log(`   - ${sensor.sensor_id} | Línea ${sensor.linea} | Lat: ${sensor.lat}, Lon: ${sensor.lon}`);
        });

        // Verificar sensores de los eventos pendientes
        console.log('\n🔍 Verificando sensores de eventos pendientes:');
        const eventosSensores = await pool.query(`
            SELECT DISTINCT e.id_sensor, s.sensor_id, s.linea
            FROM evento e
            LEFT JOIN sensores s ON e.id_sensor = s.sensor_id
            WHERE e.estampa_finalizacion IS NULL
        `);

        eventosSensores.rows.forEach(row => {
            if (row.sensor_id) {
                console.log(`   ✅ ${row.id_sensor} encontrado en sensores (Línea ${row.linea})`);
            } else {
                console.log(`   ⚠️  ${row.id_sensor} NO encontrado en tabla sensores`);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
        console.log('\n👋 Conexión cerrada');
    }
}

verificarSensores();
