// Base de datos de técnicos disponibles con ubicaciones GPS en tiempo real
export const TECHNICIANS = [
    {
        id: 'TEC-2847',
        nombre: 'Carlos Mendoza García',
        especialidad: 'Señalización y Control',
        ubicacion: { lat: 19.4326, lng: -99.1332 }, // Centro CDMX
        disponible: true,
        experiencia: 8
    },
    {
        id: 'TEC-3921',
        nombre: 'María Elena Rodríguez',
        especialidad: 'Sistemas Eléctricos',
        ubicacion: { lat: 19.4969, lng: -99.1271 }, // Norte
        disponible: true,
        experiencia: 12
    },
    {
        id: 'TEC-1456',
        nombre: 'José Luis Hernández',
        especialidad: 'Contadores de Ejes',
        ubicacion: { lat: 19.3629, lng: -99.1454 }, // Sur
        disponible: true,
        experiencia: 6
    },
    {
        id: 'TEC-5783',
        nombre: 'Ana Patricia Gómez',
        especialidad: 'Comunicaciones',
        ubicacion: { lat: 19.4284, lng: -99.2077 }, // Oeste
        disponible: true,
        experiencia: 10
    },
    {
        id: 'TEC-4129',
        nombre: 'Roberto Sánchez Pérez',
        especialidad: 'Mantenimiento General',
        ubicacion: { lat: 19.4326, lng: -99.0721 }, // Este
        disponible: true,
        experiencia: 15
    },
    {
        id: 'TEC-6847',
        nombre: 'Laura Martínez Cruz',
        especialidad: 'Señalización y Control',
        ubicacion: { lat: 19.3907, lng: -99.1759 }, // Suroeste
        disponible: true,
        experiencia: 7
    },
    {
        id: 'TEC-2134',
        nombre: 'Miguel Ángel Torres',
        especialidad: 'Sistemas Eléctricos',
        ubicacion: { lat: 19.4845, lng: -99.1947 }, // Noroeste
        disponible: true,
        experiencia: 9
    },
    {
        id: 'TEC-8956',
        nombre: 'Diana Flores Ramírez',
        especialidad: 'Contadores de Ejes',
        ubicacion: { lat: 19.3567, lng: -99.0856 }, // Sureste
        disponible: true,
        experiencia: 5
    }
];

// Calcular distancia entre dos puntos GPS (fórmula de Haversine)
export const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    return distancia;
};

// Encontrar técnicos cercanos ordenados por distancia
export const encontrarTecnicosCercanos = (ubicacionFallo, limite = 3) => {
    const tecnicosDisponibles = TECHNICIANS.filter(t => t.disponible);

    if (tecnicosDisponibles.length === 0) {
        // Si no hay técnicos disponibles, devolver todos
        return TECHNICIANS.map(t => ({
            ...t,
            distancia: calcularDistancia(
                ubicacionFallo.lat,
                ubicacionFallo.lng,
                t.ubicacion.lat,
                t.ubicacion.lng
            ).toFixed(2),
            tiempoEstimado: Math.ceil(calcularDistancia(
                ubicacionFallo.lat,
                ubicacionFallo.lng,
                t.ubicacion.lat,
                t.ubicacion.lng
            ) * 3)
        })).sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia)).slice(0, limite);
    }

    // Calcular distancias para todos los técnicos disponibles
    const tecnicosConDistancia = tecnicosDisponibles.map(tecnico => {
        const distancia = calcularDistancia(
            ubicacionFallo.lat,
            ubicacionFallo.lng,
            tecnico.ubicacion.lat,
            tecnico.ubicacion.lng
        );

        return {
            ...tecnico,
            distancia: distancia.toFixed(2),
            tiempoEstimado: Math.ceil(distancia * 3) // Estimación: 3 min por km en tráfico
        };
    });

    // Ordenar por distancia (más cercano primero)
    return tecnicosConDistancia
        .sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia))
        .slice(0, limite);
};

// Encontrar el técnico más cercano disponible (mantener compatibilidad)
export const encontrarTecnicoCercano = (ubicacionFallo) => {
    const tecnicos = encontrarTecnicosCercanos(ubicacionFallo, 1);
    return tecnicos[0];
};

// Simular actualización de ubicación de técnicos (para tiempo real)
export const actualizarUbicacionTecnico = (tecnicoId, nuevaUbicacion) => {
    const tecnico = TECHNICIANS.find(t => t.id === tecnicoId);
    if (tecnico) {
        tecnico.ubicacion = nuevaUbicacion;
    }
};

// Marcar técnico como ocupado/disponible
export const cambiarDisponibilidadTecnico = (tecnicoId, disponible) => {
    const tecnico = TECHNICIANS.find(t => t.id === tecnicoId);
    if (tecnico) {
        tecnico.disponible = disponible;
    }
};
