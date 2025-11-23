import pool from './db.js';
import readline from 'readline';

/**
 * Script interactivo para simular diferentes escenarios de técnicos
 */

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pregunta(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Ubicaciones de sensores comunes (basado en líneas del metro)
const UBICACIONES_SENSORES = [
    { nombre: 'Línea 1 - Observatorio', lat: 19.3988, lon: -99.2003 },
    { nombre: 'Línea 1 - Balderas', lat: 19.4277, lon: -99.1494 },
    { nombre: 'Línea 2 - Tasqueña', lat: 19.3244, lon: -99.1739 },
    { nombre: 'Línea 2 - Pino Suárez', lat: 19.4258, lon: -99.1333 },
    { nombre: 'Línea 3 - Indios Verdes', lat: 19.4969, lon: -99.1271 },
    { nombre: 'Línea 3 - Universidad', lat: 19.3244, lon: -99.1739 },
    { nombre: 'Línea 5 - Pantitlán', lat: 19.4154, lon: -99.0721 },
    { nombre: 'Línea 7 - El Rosario', lat: 19.5045, lon: -99.2003 },
    { nombre: 'Línea 9 - Tacubaya', lat: 19.4019, lon: -99.1871 }
];

async function mostrarMenu() {
    console.clear();
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     SIMULADOR DE ESCENARIOS - TÉCNICOS EN TURNO       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('Selecciona un escenario:\n');
    console.log('1. 🟢 Todos disponibles (cobertura completa)');
    console.log('2. 🟡 Turno reducido (50% disponibles)');
    console.log('3. 🔴 Emergencia (solo 2 técnicos disponibles)');
    console.log('4. 📍 Posicionar técnicos cerca de un sensor específico');
    console.log('5. 🎲 Distribución aleatoria');
    console.log('6. 📊 Ver estado actual');
    console.log('7. 🔄 Liberar todos los técnicos ocupados');
    console.log('8. ❌ Salir\n');
}

async function escenario1_TodosDisponibles() {
    console.log('\n🟢 ESCENARIO 1: Cobertura completa\n');

    // Poner todos disponibles
    await pool.query('UPDATE tecnicos SET disponible = true');

    // Distribuir estratégicamente
    const tecnicos = await pool.query('SELECT * FROM tecnicos ORDER BY id');
    const ubicaciones = [
        { lat: 19.4326, lon: -99.1332 }, // Centro
        { lat: 19.4969, lon: -99.1271 }, // Norte
        { lat: 19.3629, lon: -99.1454 }, // Sur
        { lat: 19.4284, lon: -99.2077 }, // Oeste
        { lat: 19.4326, lon: -99.0721 }, // Este
        { lat: 19.3907, lon: -99.1759 }, // Suroeste
        { lat: 19.4845, lon: -99.1947 }, // Noroeste
        { lat: 19.3567, lon: -99.0856 }  // Sureste
    ];

    for (let i = 0; i < tecnicos.rows.length; i++) {
        const ub = ubicaciones[i % ubicaciones.length];
        await pool.query(
            'UPDATE tecnicos SET lat = $1, lon = $2, disponible = true WHERE id = $3',
            [ub.lat, ub.lon, tecnicos.rows[i].id]
        );
    }

    console.log(`✅ ${tecnicos.rows.length} técnicos disponibles`);
    console.log('📍 Distribuidos estratégicamente en toda la CDMX\n');
}

async function escenario2_TurnoReducido() {
    console.log('\n🟡 ESCENARIO 2: Turno reducido (50%)\n');

    const tecnicos = await pool.query('SELECT * FROM tecnicos ORDER BY id');
    const mitad = Math.ceil(tecnicos.rows.length / 2);

    // Primera mitad disponible
    for (let i = 0; i < mitad; i++) {
        await pool.query(
            'UPDATE tecnicos SET disponible = true WHERE id = $1',
            [tecnicos.rows[i].id]
        );
        console.log(`✅ ${tecnicos.rows[i].id} - ${tecnicos.rows[i].nombre} (DISPONIBLE)`);
    }

    // Segunda mitad ocupada
    for (let i = mitad; i < tecnicos.rows.length; i++) {
        await pool.query(
            'UPDATE tecnicos SET disponible = false WHERE id = $1',
            [tecnicos.rows[i].id]
        );
        console.log(`❌ ${tecnicos.rows[i].id} - ${tecnicos.rows[i].nombre} (OCUPADO)`);
    }

    console.log(`\n📊 ${mitad} técnicos disponibles de ${tecnicos.rows.length}\n`);
}

async function escenario3_Emergencia() {
    console.log('\n🔴 ESCENARIO 3: Emergencia (solo 2 técnicos)\n');

    const tecnicos = await pool.query('SELECT * FROM tecnicos ORDER BY experiencia DESC');

    // Marcar todos como ocupados
    await pool.query('UPDATE tecnicos SET disponible = false');

    // Solo los 2 más experimentados disponibles
    for (let i = 0; i < Math.min(2, tecnicos.rows.length); i++) {
        await pool.query(
            'UPDATE tecnicos SET disponible = true WHERE id = $1',
            [tecnicos.rows[i].id]
        );
        console.log(`✅ ${tecnicos.rows[i].id} - ${tecnicos.rows[i].nombre}`);
        console.log(`   Experiencia: ${tecnicos.rows[i].experiencia} años`);
        console.log(`   Especialidad: ${tecnicos.rows[i].especialidad}\n`);
    }

    console.log('⚠️  Situación crítica: cobertura mínima\n');
}

async function escenario4_CercaDeSensor() {
    console.log('\n📍 ESCENARIO 4: Posicionar cerca de sensor\n');
    console.log('Ubicaciones de sensores disponibles:\n');

    UBICACIONES_SENSORES.forEach((ub, i) => {
        console.log(`${i + 1}. ${ub.nombre}`);
    });

    const opcion = await pregunta('\nSelecciona ubicación (1-9): ');
    const index = parseInt(opcion) - 1;

    if (index < 0 || index >= UBICACIONES_SENSORES.length) {
        console.log('❌ Opción inválida');
        return;
    }

    const ubicacion = UBICACIONES_SENSORES[index];
    const tecnicos = await pool.query('SELECT * FROM tecnicos WHERE disponible = true');

    if (tecnicos.rows.length === 0) {
        console.log('⚠️  No hay técnicos disponibles. Liberando todos...');
        await pool.query('UPDATE tecnicos SET disponible = true');
        return escenario4_CercaDeSensor();
    }

    console.log(`\n🎯 Posicionando técnicos cerca de: ${ubicacion.nombre}\n`);

    // Posicionar técnicos en un radio de ~2km
    for (const tecnico of tecnicos.rows) {
        const radioKm = 2;
        const latVariacion = (Math.random() - 0.5) * (radioKm / 111); // 1 grado lat ≈ 111km
        const lonVariacion = (Math.random() - 0.5) * (radioKm / 111);

        const nuevaLat = ubicacion.lat + latVariacion;
        const nuevaLon = ubicacion.lon + lonVariacion;

        await pool.query(
            'UPDATE tecnicos SET lat = $1, lon = $2 WHERE id = $3',
            [nuevaLat, nuevaLon, tecnico.id]
        );

        console.log(`📍 ${tecnico.id} - ${tecnico.nombre}`);
        console.log(`   Posición: ${nuevaLat.toFixed(4)}, ${nuevaLon.toFixed(4)}\n`);
    }

    console.log('✅ Técnicos posicionados estratégicamente\n');
}

async function escenario5_Aleatorio() {
    console.log('\n🎲 ESCENARIO 5: Distribución aleatoria\n');

    const tecnicos = await pool.query('SELECT * FROM tecnicos ORDER BY id');

    for (const tecnico of tecnicos.rows) {
        // Disponibilidad aleatoria (70% disponible)
        const disponible = Math.random() > 0.3;

        // Ubicación aleatoria en CDMX
        const lat = 19.2 + Math.random() * 0.5; // Entre 19.2 y 19.7
        const lon = -99.3 + Math.random() * 0.3; // Entre -99.3 y -99.0

        await pool.query(
            'UPDATE tecnicos SET lat = $1, lon = $2, disponible = $3 WHERE id = $4',
            [lat, lon, disponible, tecnico.id]
        );

        console.log(`${disponible ? '✅' : '❌'} ${tecnico.id} - ${tecnico.nombre}`);
        console.log(`   Ubicación: ${lat.toFixed(4)}, ${lon.toFixed(4)}\n`);
    }

    const disponibles = await pool.query('SELECT COUNT(*) FROM tecnicos WHERE disponible = true');
    console.log(`📊 ${disponibles.rows[0].count} técnicos disponibles de ${tecnicos.rows.length}\n`);
}

async function escenario6_VerEstado() {
    console.log('\n📊 ESTADO ACTUAL DEL SISTEMA\n');

    const tecnicos = await pool.query('SELECT * FROM tecnicos ORDER BY disponible DESC, id');
    const disponibles = tecnicos.rows.filter(t => t.disponible).length;
    const ocupados = tecnicos.rows.length - disponibles;

    console.log(`Total: ${tecnicos.rows.length} técnicos`);
    console.log(`✅ Disponibles: ${disponibles}`);
    console.log(`❌ Ocupados: ${ocupados}\n`);

    console.log('Detalle:\n');
    tecnicos.rows.forEach(t => {
        console.log(`${t.disponible ? '✅' : '❌'} ${t.id} - ${t.nombre}`);
        console.log(`   Especialidad: ${t.especialidad}`);
        console.log(`   Experiencia: ${t.experiencia} años`);
        console.log(`   Ubicación: ${t.lat}, ${t.lon}`);
        console.log(`   Última actualización: ${t.fecha_actualizacion}\n`);
    });
}

async function escenario7_LiberarTodos() {
    console.log('\n🔄 LIBERANDO TODOS LOS TÉCNICOS\n');

    const result = await pool.query(
        'UPDATE tecnicos SET disponible = true WHERE disponible = false RETURNING *'
    );

    if (result.rows.length === 0) {
        console.log('ℹ️  Todos los técnicos ya estaban disponibles\n');
    } else {
        console.log(`✅ ${result.rows.length} técnico(s) liberado(s):\n`);
        result.rows.forEach(t => {
            console.log(`   ${t.id} - ${t.nombre}`);
        });
        console.log();
    }
}

async function ejecutarSimulador() {
    try {
        let continuar = true;

        while (continuar) {
            await mostrarMenu();
            const opcion = await pregunta('Selecciona una opción: ');

            switch (opcion) {
                case '1':
                    await escenario1_TodosDisponibles();
                    break;
                case '2':
                    await escenario2_TurnoReducido();
                    break;
                case '3':
                    await escenario3_Emergencia();
                    break;
                case '4':
                    await escenario4_CercaDeSensor();
                    break;
                case '5':
                    await escenario5_Aleatorio();
                    break;
                case '6':
                    await escenario6_VerEstado();
                    break;
                case '7':
                    await escenario7_LiberarTodos();
                    break;
                case '8':
                    console.log('\n👋 ¡Hasta luego!\n');
                    continuar = false;
                    break;
                default:
                    console.log('\n❌ Opción inválida\n');
            }

            if (continuar && opcion !== '6') {
                await pregunta('Presiona Enter para continuar...');
            }
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        rl.close();
        await pool.end();
    }
}

// Ejecutar simulador
ejecutarSimulador();
