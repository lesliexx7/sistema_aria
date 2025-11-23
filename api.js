// Servicio para comunicación con el backend
const API_URL = 'http://localhost:3002/api';

export const fetchEventosPendientes = async () => {
    try {
        const response = await fetch(`${API_URL}/eventos/pendientes`);
        if (!response.ok) {
            throw new Error('Error al obtener eventos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en fetchEventosPendientes:', error);
        throw error;
    }
};

export const actualizarEstadoEvento = async (ticketId, estado) => {
    try {
        const response = await fetch(`${API_URL}/eventos/${ticketId}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar estado');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en actualizarEstadoEvento:', error);
        throw error;
    }
};
