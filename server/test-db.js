import pool from './db.js';

async function testConnection() {
    try {
        console.log('🔍 Probando conexión a PostgreSQL...');

        // Test de conexión
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Conexión exitosa!');
        console.log('⏰ Hora del servidor:', result.rows[0].now);

        // Verificar tabla evento
        console.log('\n🔍 Verificando tabla evento...');
        const tableCheck = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'evento'
            ORDER BY ordinal_position
        `);

        if (tableCheck.rows.length > 0) {
            console.log('✅ Tabla evento encontrada con columnas:');
            tableCheck.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type})`);
            });
        } else {
            console.log('⚠️  Tabla evento no encontrada');
        }

        // Contar eventos pendientes (sin estampa_finalizacion)
        console.log('\n🔍 Contando eventos pendientes...');
        const countResult = await pool.query(`
            SELECT COUNT(*) as total 
            FROM evento 
            WHERE estampa_finalizacion IS NULL
        `);
        console.log(`📊 Eventos pendientes: ${countResult.rows[0].total}`);

        // Mostrar algunos eventos de ejemplo
        console.log('\n🔍 Eventos de ejemplo:');
        const sampleEvents = await pool.query(`
            SELECT id, timestamp, id_sensor, severidad, estampa_asignacion, estampa_finalizacion
            FROM evento 
            ORDER BY timestamp DESC
            LIMIT 5
        `);

        if (sampleEvents.rows.length > 0) {
            console.log('✅ Eventos encontrados:');
            sampleEvents.rows.forEach(event => {
                const estado = event.estampa_finalizacion ? 'Finalizado' : event.estampa_asignacion ? 'Asignado' : 'Pendiente';
                console.log(`   - Ticket #${event.id} | Sensor: ${event.id_sensor} | Estado: ${estado} | Severidad: ${event.severidad || 'N/A'}`);
            });
        } else {
            console.log('⚠️  No hay eventos en la base de datos');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    } finally {
        await pool.end();
        console.log('\n👋 Conexión cerrada');
    }
}

testConnection();
