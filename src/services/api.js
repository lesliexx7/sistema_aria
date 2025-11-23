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

export const actualizarEstadoEvento = async (ticketId, estado, severidad = null) => {
    try {
        const body = { estado };
        if (severidad) {
            body.severidad = severidad;
        }

        const response = await fetch(`${API_URL}/eventos/${ticketId}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
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

export const finalizarEvento = async (ticketId, reporte = null, tiempoAtencionMinutos = 0, severidad = null) => {
    try {
        const response = await fetch(`${API_URL}/eventos/${ticketId}/finalizar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reporte,
                tiempoAtencionMinutos,
                severidad
            }),
        });

        if (!response.ok) {
            throw new Error('Error al finalizar evento');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en finalizarEvento:', error);
        throw error;
    }
};

export const guardarReporteFinal = async (reporteData) => {
    try {
        const response = await fetch(`${API_URL}/reportes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reporteData),
        });

        if (!response.ok) {
            throw new Error('Error al guardar reporte final');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en guardarReporteFinal:', error);
        throw error;
    }
};

export const fetchEventosFinalizados = async (limit = 50) => {
    try {
        const response = await fetch(`${API_URL}/eventos/finalizados?limit=${limit}`);
        if (!response.ok) {
            throw new Error('Error al obtener eventos finalizados');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en fetchEventosFinalizados:', error);
        throw error;
    }
};

export const obtenerTecnicosCercanos = async (lat, lng) => {
    try {
        const response = await fetch(`${API_URL}/tecnicos/cercanos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lat, lng }),
        });

        if (!response.ok) {
            throw new Error('Error al obtener técnicos cercanos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en obtenerTecnicosCercanos:', error);
        throw error;
    }
};

export const asignarTecnicoAEvento = async (eventoId, tecnicoId) => {
    try {
        const response = await fetch(`${API_URL}/eventos/${eventoId}/asignar-tecnico`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tecnicoId }),
        });

        if (!response.ok) {
            throw new Error('Error al asignar técnico');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en asignarTecnicoAEvento:', error);
        throw error;
    }
};

export const liberarTecnico = async (tecnicoId) => {
    try {
        const response = await fetch(`${API_URL}/tecnicos/${tecnicoId}/liberar`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            throw new Error('Error al liberar técnico');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en liberarTecnico:', error);
        throw error;
    }
};

export const enviarReportePorCorreo = async (reporteId, destinatarios) => {
    try {
        const response = await fetch(`${API_URL}/reportes/enviar-correo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reporteId, destinatarios }),
        });

        if (!response.ok) {
            throw new Error('Error al enviar reporte por correo');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en enviarReportePorCorreo:', error);
        throw error;
    }
};

export const enviarReportePorCorreoDirecto = async (reporte, destinatarios) => {
    try {
        console.log('📧 [API] Enviando reporte por correo...');
        console.log('   Destinatarios:', destinatarios);
        console.log('   OT:', reporte.numeroOT);

        const response = await fetch(`${API_URL}/reportes/enviar-correo-directo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reporte, destinatarios }),
        });

        console.log('   Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('   Error response:', errorText);
            throw new Error(`Error al enviar reporte por correo: ${response.status}`);
        }

        const result = await response.json();
        console.log('   ✅ Respuesta del servidor:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en enviarReportePorCorreoDirecto:', error);
        throw error;
    }
};

export const verificarConfiguracionCorreo = async () => {
    try {
        const response = await fetch(`${API_URL}/email/verificar`);
        if (!response.ok) {
            throw new Error('Error al verificar configuración de correo');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en verificarConfiguracionCorreo:', error);
        throw error;
    }
};
