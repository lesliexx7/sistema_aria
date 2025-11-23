import pool from './db.js';

async function checkTables() {
    try {
        console.log('🔍 Verificando tablas en la base de datos...\n');

        // Listar todas las tablas
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        if (result.rows.length > 0) {
            console.log('✅ Tablas encontradas:');
            result.rows.forEach(row => {
                console.log(`   - ${row.table_name}`);
            });
        } else {
            console.log('⚠️  No hay tablas en el schema public');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkTables();
