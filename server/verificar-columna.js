import pool from './db.js';

async function verificarColumna() {
    try {
        console.log('🔍 Verificando estructura de la tabla evento...\n');

        // Verificar columnas
        const columns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'evento'
            ORDER BY ordinal_position
        `);

        console.log('Columnas de la tabla evento:');
        columns.rows.forEach(col => {
            const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(NOT NULL)';
            console.log(`  ✓ ${col.column_name.padEnd(25)} ${col.data_type.padEnd(30)} ${nullable}`);
        });

        // Verificar si existe estampa_finalizacion
        const tieneColumna = columns.rows.some(col => col.column_name === 'estampa_finalizacion');

        if (tieneColumna) {
            console.log('\n✅ La columna estampa_finalizacion existe');
        } else {
            console.log('\n⚠️  La columna estampa_finalizacion NO existe');
            console.log('\nEjecuta este comando en psql:');
            console.log('ALTER TABLE evento ADD COLUMN estampa_finalizacion TIMESTAMP WITH TIME ZONE;');
        }

        // Mostrar eventos de ejemplo
        console.log('\n📊 Eventos de ejemplo:');
        const eventos = await pool.query(`
            SELECT id, timestamp, id_sensor, severidad, estampa_asignacion, estampa_finalizacion
            FROM evento
            ORDER BY id DESC
            LIMIT 5
        `);

        eventos.rows.forEach(e => {
            console.log(`\nEvento #${e.id}:`);
            console.log(`  Timestamp: ${e.timestamp}`);
            console.log(`  Sensor: ${e.id_sensor || 'sin asignar'}`);
            console.log(`  Severidad: ${e.severidad || 'sin asignar'}`);
            console.log(`  Asignación: ${e.estampa_asignacion || 'pendiente'}`);
            console.log(`  Finalización: ${e.estampa_finalizacion || 'pendiente'}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verificarColumna();
