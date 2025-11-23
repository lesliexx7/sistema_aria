import pool from './db.js';

async function verificarColumna() {
    try {
        console.log('🔍 Verificando columna tiempo_atencion_minutos...\n');

        // Verificar si existe la columna
        const checkColumn = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'evento' 
            AND column_name = 'tiempo_atencion_minutos'
        `);

        if (checkColumn.rows.length > 0) {
            console.log('✅ La columna tiempo_atencion_minutos ya existe');
        } else {
            console.log('⚠️  La columna tiempo_atencion_minutos NO existe');
            console.log('📝 Agregando columna...');

            await pool.query(`
                ALTER TABLE evento 
                ADD COLUMN tiempo_atencion_minutos INTEGER
            `);

            console.log('✅ Columna tiempo_atencion_minutos agregada exitosamente');
        }

        // Mostrar estructura actualizada
        console.log('\n📋 Estructura actual de la tabla evento:');
        const columns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'evento'
            ORDER BY ordinal_position
        `);

        columns.rows.forEach(col => {
            console.log(`   ✓ ${col.column_name.padEnd(30)} ${col.data_type.padEnd(30)} (${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'})`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
        console.log('\n👋 Conexión cerrada');
    }
}

verificarColumna();
