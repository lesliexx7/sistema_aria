// Base de datos de sensores del Metro CDMX
export const METRO_LINES = {
    1: { nombre: 'Observatorio - Pantitlán', sensores: 32, color: '#F54291' },
    2: { nombre: 'Cuatro Caminos - Tasqueña', sensores: 40, color: '#0065B3' },
    3: { nombre: 'Indios Verdes - Universidad', sensores: 41, color: '#AF9800' },
    4: { nombre: 'Martín Carrera - Santa Anita', sensores: 18, color: '#73C5C5' },
    5: { nombre: 'Politécnico - Pantitlán', sensores: 27, color: '#FED100' },
    6: { nombre: 'El Rosario - Martín Carrera', sensores: 21, color: '#E32119' },
    7: { nombre: 'El Rosario - Barranca del Muerto', sensores: 32, color: '#FF6B00' },
    8: { nombre: 'Garibaldi - Constitución de 1917', sensores: 34, color: '#00A650' },
    9: { nombre: 'Tacubaya - Pantitlán', sensores: 25, color: '#522D12' },
    A: { nombre: 'Pantitlán - La Paz', sensores: 28, color: '#A02C7D' },
    B: { nombre: 'Buenavista - Ciudad Azteca', sensores: 39, color: '#00853E' },
    12: { nombre: 'Mixcoac - Tláhuac', sensores: 48, color: '#B49F34' }
};

// Muestra de sensores por línea (3-5 sensores por línea para mantener el archivo manejable)
export const ALL_SENSORS = [
    // Línea 1 - Observatorio - Pantitlán (32 sensores)
    { id: 'L1_S001', linea: 1, lat: 19.39955, lng: -99.1959, pk: 3.03 },
    { id: 'L1_S010', linea: 1, lat: 19.42319, lng: -99.1652, pk: 30.3 },
    { id: 'L1_S020', linea: 1, lat: 19.42803, lng: -99.1209, pk: 60.61 },
    { id: 'L1_S032', linea: 1, lat: 19.41165, lng: -99.0754, pk: 96.97 },

    // Línea 2 - Cuatro Caminos - Tasqueña (40 sensores)
    { id: 'L2_S001', linea: 2, lat: 19.46311, lng: -99.2141, pk: 2.44 },
    { id: 'L2_S010', linea: 2, lat: 19.45268, lng: -99.1752, pk: 24.39 },
    { id: 'L2_S020', linea: 2, lat: 19.4351, lng: -99.1336, pk: 48.78 },
    { id: 'L2_S030', linea: 2, lat: 19.39024, lng: -99.1386, pk: 73.17 },
    { id: 'L2_S040', linea: 2, lat: 19.34435, lng: -99.1441, pk: 97.56 },

    // Línea 3 - Indios Verdes - Universidad (41 sensores)
    { id: 'L3_S001', linea: 3, lat: 19.49093, lng: -99.1208, pk: 2.38 },
    { id: 'L3_S010', linea: 3, lat: 19.4572, lng: -99.1432, pk: 23.81 },
    { id: 'L3_S020', linea: 3, lat: 19.41346, lng: -99.1538, pk: 47.62 },
    { id: 'L3_S030', linea: 3, lat: 19.36991, lng: -99.1653, pk: 71.43 },
    { id: 'L3_S041', linea: 3, lat: 19.32895, lng: -99.1734, pk: 97.62 },

    // Línea 4 - Martín Carrera - Santa Anita (18 sensores)
    { id: 'L4_S001', linea: 4, lat: 19.40735, lng: -99.1217, pk: 5.26 },
    { id: 'L4_S009', linea: 4, lat: 19.44277, lng: -99.1176, pk: 47.37 },
    { id: 'L4_S018', linea: 4, lat: 19.48131, lng: -99.1068, pk: 94.74 },

    // Línea 5 - Politécnico - Pantitlán (27 sensores)
    { id: 'L5_S001', linea: 5, lat: 19.49627, lng: -99.1473, pk: 3.57 },
    { id: 'L5_S010', linea: 5, lat: 19.46094, lng: -99.1257, pk: 35.71 },
    { id: 'L5_S020', linea: 5, lat: 19.44225, lng: -99.0856, pk: 71.43 },
    { id: 'L5_S027', linea: 5, lat: 19.41754, lng: -99.0784, pk: 96.43 },

    // Línea 6 - El Rosario - Martín Carrera (21 sensores)
    { id: 'L6_S001', linea: 6, lat: 19.49998, lng: -99.2013, pk: 4.55 },
    { id: 'L6_S010', linea: 6, lat: 19.48809, lng: -99.1619, pk: 45.45 },
    { id: 'L6_S021', linea: 6, lat: 19.48125, lng: -99.1115, pk: 95.45 },

    // Línea 7 - El Rosario - Barranca del Muerto (32 sensores)
    { id: 'L7_S001', linea: 7, lat: 19.50028, lng: -99.2016, pk: 3.03 },
    { id: 'L7_S010', linea: 7, lat: 19.46262, lng: -99.1904, pk: 30.3 },
    { id: 'L7_S020', linea: 7, lat: 19.41965, lng: -99.193, pk: 60.61 },
    { id: 'L7_S032', linea: 7, lat: 19.36616, lng: -99.1887, pk: 96.97 },

    // Línea 8 - Garibaldi - Constitución de 1917 (34 sensores)
    { id: 'L8_S001', linea: 8, lat: 19.43952, lng: -99.14, pk: 2.86 },
    { id: 'L8_S010', linea: 8, lat: 19.41004, lng: -99.1305, pk: 28.57 },
    { id: 'L8_S020', linea: 8, lat: 19.37642, lng: -99.1085, pk: 57.14 },
    { id: 'L8_S034', linea: 8, lat: 19.34798, lng: -99.068, pk: 97.14 },

    // Línea 9 - Tacubaya - Pantitlán (25 sensores)
    { id: 'L9_S001', linea: 9, lat: 19.41141, lng: -99.0748, pk: 3.85 },
    { id: 'L9_S010', linea: 9, lat: 19.4086, lng: -99.1151, pk: 38.46 },
    { id: 'L9_S020', linea: 9, lat: 19.40623, lng: -99.162, pk: 76.92 },
    { id: 'L9_S025', linea: 9, lat: 19.40332, lng: -99.1838, pk: 96.15 },

    // Línea A - Pantitlán - La Paz (28 sensores)
    { id: 'LA_S001', linea: 'A', lat: 19.41136, lng: -99.0747, pk: 3.45 },
    { id: 'LA_S010', linea: 'A', lat: 19.38781, lng: -99.0402, pk: 34.48 },
    { id: 'LA_S020', linea: 'A', lat: 19.36105, lng: -99.0003, pk: 68.97 },
    { id: 'LA_S028', linea: 'A', lat: 19.35471, lng: -98.9633, pk: 96.55 },

    // Línea B - Buenavista - Ciudad Azteca (39 sensores)
    { id: 'LB_S001', linea: 'B', lat: 19.44541, lng: -99.1477, pk: 2.5 },
    { id: 'LB_S010', linea: 'B', lat: 19.43223, lng: -99.1133, pk: 25 },
    { id: 'LB_S020', linea: 'B', lat: 19.45558, lng: -99.0727, pk: 50 },
    { id: 'LB_S030', linea: 'B', lat: 19.49148, lng: -99.0464, pk: 75 },
    { id: 'LB_S039', linea: 'B', lat: 19.5302, lng: -99.0294, pk: 97.5 },

    // Línea 12 - Mixcoac - Tláhuac (48 sensores)
    { id: 'L12_S001', linea: 12, lat: 19.37449, lng: -99.1823, pk: 2.04 },
    { id: 'L12_S010', linea: 12, lat: 19.36076, lng: -99.1476, pk: 20.41 },
    { id: 'L12_S025', linea: 12, lat: 19.32918, lng: -99.1065, pk: 51.02 },
    { id: 'L12_S040', linea: 12, lat: 19.30023, lng: -99.0486, pk: 81.63 },
    { id: 'L12_S048', linea: 12, lat: 19.28933, lng: -99.0169, pk: 97.96 },
];

export const getRandomSensor = () => {
    const randomIndex = Math.floor(Math.random() * ALL_SENSORS.length);
    const sensor = ALL_SENSORS[randomIndex];
    return {
        ...sensor,
        lineaInfo: METRO_LINES[sensor.linea]
    };
};

export const getSensorsByLine = (linea) => {
    return ALL_SENSORS.filter(s => s.linea == linea);
};
