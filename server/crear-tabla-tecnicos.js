import pool from './db.js';
import fs from 'fs';

async function crearTablaTecnicos() {
    try {
        console.log('📋 Creando tabla de técnicos...\n');

        const sql = fs.readFileSync('./crear-tabla-tecnicos.sql', 'utf8');

        await pool.query(sql);

        console.log('✅ Tabla tecnicos creada e inicializada exitosamente\n');

        // Verificar
        const result = await pool.query('SELECT * FROM tecnicos ORDER BY id');
        console.log(`📊 Total de técnicos: ${result.rows.length}\n`);

        console.log('👥 Técnicos registrados:');
        result.rows.forEach(t => {
            console.log(`   ${t.id} - ${t.nombre}`);
            console.log(`      ${t.especialidad} | ${t.experiencia} años exp.`);
            console.log(`      Ubicación: ${t.lat}, ${t.lon}`);
            console.log(`      Estado: ${t.disponible ? '✅ Disponible' : '❌ Ocupado'}\n`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
        console.log('👋 Conexión cerrada');
    }
}

crearTablaTecnicos();
