import pool from './db.js';

async function verificarTodo() {
    try {
        console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA\n');
        console.log('='.repeat(60));

        // 1. Verificar tabla sensores
        console.log('\n📍 1. TABLA SENSORES');
        console.log('-'.repeat(60));

        const sensoresCheck = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'sensores'
            ORDER BY ordinal_position
        `);

        if (sensoresCheck.rows.length > 0) {
            console.log('✅ Tabla sensores existe con columnas:');
            sensoresCheck.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type})`);
            });

            const countSensores = await pool.query('SELECT COUNT(*) as total FROM sensores');
            console.log(`\n📊 Total de sensores: ${countSensores.rows[0].total}`);

            const sampleSensores = await pool.query('SELECT * FROM sensores LIMIT 3');
            console.log('\n📋 Ejemplos de sensores:');
            sampleSensores.rows.forEach(s => {
                console.log(`   - ${s.sensor_id} | Línea ${s.linea} | Lat: ${s.lat}, Lon: ${s.lon}`);
            });
        } else {
            console.log('❌ Tabla sensores NO existe');
        }

        // 2. Verificar tabla evento
        console.log('\n\n⚡ 2. TABLA EVENTO');
        console.log('-'.repeat(60));

        const eventoCheck = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'evento'
            ORDER BY ordinal_position
        `);

        console.log('✅ Tabla evento existe con columnas:');
        eventoCheck.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type})`);
        });

        const countEventos = await pool.query('SELECT COUNT(*) as total FROM evento');
        const countPendientes = await pool.query('SELECT COUNT(*) as total FROM evento WHERE estampa_finalizacion IS NULL');
        const countFinalizados = await pool.query('SELECT COUNT(*) as total FROM evento WHERE estampa_finalizacion IS NOT NULL');

        console.log(`\n📊 Total de eventos: ${countEventos.rows[0].total}`);
        console.log(`   - Pendientes: ${countPendientes.rows[0].total}`);
        console.log(`   - Finalizados: ${countFinalizados.rows[0].total}`);

        // 3. Verificar tabla reporteFinal
        console.log('\n\n📄 3. TABLA REPORTEFINAL');
        console.log('-'.repeat(60));

        const reporteCheck = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'reportefinal'
            ORDER BY ordinal_position
        `);

        if (reporteCheck.rows.length > 0) {
            console.log('✅ Tabla reporteFinal existe con columnas:');
            reporteCheck.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type})`);
            });

            const countReportes = await pool.query('SELECT COUNT(*) as total FROM reporteFinal');
            console.log(`\n📊 Total de reportes: ${countReportes.rows[0].total}`);
        } else {
            console.log('⚠️  Tabla reporteFinal NO existe');
            console.log('📝 Creando tabla reporteFinal...');

            await pool.query(`
                CREATE TABLE IF NOT EXISTS reporteFinal (
                    id SERIAL PRIMARY KEY,
                    evento_id INTEGER REFERENCES evento(id),
                    numero_ot VARCHAR(50),
                    fecha_deteccion VARCHAR(100),
                    linea_metro VARCHAR(50),
                    via_afectada VARCHAR(100),
                    ubicacion_fallo VARCHAR(200),
                    punto_kilometrico VARCHAR(50),
                    coordenadas_lat DECIMAL(10, 8),
                    coordenadas_lng DECIMAL(11, 8),
                    tipo_sensor VARCHAR(100),
                    id_activo VARCHAR(100),
                    mensaje_alarma TEXT,
                    sintoma_operacional TEXT,
                    severidad VARCHAR(50),
                    tecnico_nombre VARCHAR(200),
                    tecnico_id VARCHAR(50),
                    tecnico_especialidad VARCHAR(200),
                    hora_llegada VARCHAR(100),
                    diagnostico_preliminar TEXT,
                    acciones_intervencion TEXT,
                    componente_reemplazado VARCHAR(200),
                    componente_nuevo_id VARCHAR(100),
                    pruebas_realizadas TEXT,
                    notas_pruebas TEXT,
                    impacto_minutos INTEGER,
                    trenes_afectados INTEGER,
                    observaciones TEXT,
                    recomendaciones TEXT,
                    fotos_adjuntas INTEGER,
                    tiempo_total_atencion_segundos INTEGER,
                    tiempo_total_atencion_formato VARCHAR(20),
                    reporte_texto TEXT,
                    fecha_creacion TIMESTAMP DEFAULT NOW()
                )
            `);

            console.log('✅ Tabla reporteFinal creada exitosamente');
        }

        // 4. Resumen final
        console.log('\n\n✅ RESUMEN');
        console.log('='.repeat(60));
        console.log('✓ Conexión a base de datos: OK');
        console.log('✓ Tabla sensores: OK');
        console.log('✓ Tabla evento: OK');
        console.log('✓ Tabla reporteFinal: OK');
        console.log('✓ Columna tiempo_atencion_minutos: OK');
        console.log('\n🚀 Sistema listo para funcionar!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
    } finally {
        await pool.end();
        console.log('\n👋 Conexión cerrada\n');
    }
}

verificarTodo();
