import pool from './db.js';

async function checkStructure() {
    try {
        console.log('🔍 Verificando estructura de tablas...\n');

        // Verificar tabla evento
        console.log('📋 Tabla: evento');
        const eventoColumns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'evento'
            ORDER BY ordinal_position
        `);

        if (eventoColumns.rows.length > 0) {
            console.log('Columnas:');
            eventoColumns.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
            });
        }

        // Contar registros
        const count = await pool.query('SELECT COUNT(*) as total FROM evento');
        console.log(`Total de registros: ${count.rows[0].total}\n`);

        // Mostrar algunos registros
        const sample = await pool.query('SELECT * FROM evento LIMIT 3');
        if (sample.rows.length > 0) {
            console.log('Registros de ejemplo:');
            sample.rows.forEach((row, i) => {
                console.log(`\nRegistro ${i + 1}:`, JSON.stringify(row, null, 2));
            });
        }

        console.log('\n\n📋 Tabla: sensores');
        const sensoresColumns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'sensores'
            ORDER BY ordinal_position
        `);

        if (sensoresColumns.rows.length > 0) {
            console.log('Columnas:');
            sensoresColumns.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
            });
        }

        // Contar registros
        const countSensores = await pool.query('SELECT COUNT(*) as total FROM sensores');
        console.log(`Total de registros: ${countSensores.rows[0].total}\n`);

        // Mostrar algunos registros
        const sampleSensores = await pool.query('SELECT * FROM sensores LIMIT 3');
        if (sampleSensores.rows.length > 0) {
            console.log('Registros de ejemplo:');
            sampleSensores.rows.forEach((row, i) => {
                console.log(`\nRegistro ${i + 1}:`, JSON.stringify(row, null, 2));
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkStructure();
