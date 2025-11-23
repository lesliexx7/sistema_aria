import express from 'express';
import cors from 'cors';
import pool from './db.js';
import fetch from 'node-fetch';
import { enviarReportePorCorreo, verificarConfiguracionCorreo } from './email-service.js';

const app = express();
const PORT = process.env.PORT || 3002;
const GOOGLE_MAPS_API_KEY = 'AIzaSyC7NXQukGGQtFCZaSNz_KbYL5PD68825oo';

app.use(cors());
app.use(express.json());

// Endpoint para obtener eventos pendientes con información del sensor
app.get('/api/eventos/pendientes', async (req, res) => {
    try {
        // Obtener eventos que no tienen estampa_finalizacion (pendientes)
        // Pueden tener o no estampa_asignacion, pero no deben estar finalizados
        const result = await pool.query(`
            SELECT 
                e.id as ticket_id,
                e.timestamp,
                e.id_sensor,
                e.severidad,
                e.estampa_asignacion
            FROM evento e
            WHERE e.estampa_finalizacion IS NULL
            ORDER BY e.timestamp DESC
        `);

        // Enriquecer con datos del sensor desde la tabla sensores
        const eventosEnriquecidos = [];

        for (const evento of result.rows) {
            if (!evento.id_sensor) {
                console.warn(`Evento ${evento.ticket_id} sin id_sensor`);
                continue;
            }

            // Buscar sensor en la base de datos
            const sensorResult = await pool.query(
                'SELECT sensor_id, linea, lat, lon FROM sensores WHERE sensor_id = $1 LIMIT 1',
                [evento.id_sensor]
            );

            if (sensorResult.rows.length === 0) {
                console.warn(`Sensor no encontrado en DB: ${evento.id_sensor}`);
                continue;
            }

            const sensor = sensorResult.rows[0];

            eventosEnriquecidos.push({
                ticketId: evento.ticket_id,
                timestamp: evento.timestamp,
                sensorId: sensor.sensor_id,
                linea: sensor.linea,
                lat: sensor.lat,
                lng: sensor.lon,
                severidad: evento.severidad
            });
        }

        console.log(`📊 Eventos pendientes encontrados: ${eventosEnriquecidos.length}`);
        res.json(eventosEnriquecidos);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error al obtener eventos pendientes' });
    }
});

// Endpoint para actualizar estado de evento
app.patch('/api/eventos/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, severidad } = req.body;

        console.log(`📝 Actualizando evento ${id}: estado=${estado}, severidad=${severidad || 'sin cambio'}`);

        // Cuando se asigna, actualizar estampa_asignacion y severidad
        // Aceptar tanto 'en-camino' como 'en-route' (del frontend)
        if (estado === 'en-camino' || estado === 'en-route' || estado === 'asignado') {
            // Si se proporciona severidad, actualizar ambos campos
            if (severidad) {
                const result = await pool.query(
                    'UPDATE evento SET estampa_asignacion = NOW(), severidad = $1 WHERE id = $2 RETURNING *',
                    [severidad, id]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Evento no encontrado' });
                }

                console.log(`✅ Evento ${id} actualizado: severidad=${severidad}, estampa_asignacion=${result.rows[0].estampa_asignacion}`);
                return res.json(result.rows[0]);
            }

            // Si no hay severidad, solo actualizar estampa_asignacion
            const result = await pool.query(
                'UPDATE evento SET estampa_asignacion = NOW() WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            console.log(`✅ Evento ${id} actualizado: estampa_asignacion=${result.rows[0].estampa_asignacion}`);
            return res.json(result.rows[0]);
        }

        // Para otros estados, solo devolver el evento
        const result = await pool.query(
            'SELECT * FROM evento WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado del evento' });
    }
});

// Endpoint para finalizar evento (cuando se envía el reporte)
app.patch('/api/eventos/:id/finalizar', async (req, res) => {
    try {
        const { id } = req.params;
        const { tiempoAtencionMinutos, severidad } = req.body;

        console.log(`📝 Finalizando evento ${id}`);
        console.log(`   - Tiempo de atención: ${tiempoAtencionMinutos} minutos`);
        console.log(`   - Severidad: ${severidad || 'sin cambio'}`);

        // Actualizar estampa_finalizacion, tiempo_atencion_minutos y severidad
        const result = await pool.query(
            'UPDATE evento SET estampa_finalizacion = NOW(), tiempo_atencion_minutos = $1, severidad = COALESCE($2, severidad) WHERE id = $3 RETURNING *',
            [tiempoAtencionMinutos, severidad, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const evento = result.rows[0];
        console.log(`✅ Evento ${id} finalizado:`);
        console.log(`   - Inicio: ${evento.timestamp}`);
        console.log(`   - Asignación: ${evento.estampa_asignacion}`);
        console.log(`   - Finalización: ${evento.estampa_finalizacion}`);
        console.log(`   - Tiempo total: ${evento.tiempo_atencion_minutos} minutos`);
        console.log(`   - Severidad: ${evento.severidad}`);

        res.json(evento);
    } catch (error) {
        console.error('Error al finalizar evento:', error);
        res.status(500).json({ error: 'Error al finalizar evento' });
    }
});

// Endpoint para guardar el reporte final completo
app.post('/api/reportes', async (req, res) => {
    try {
        const {
            eventoId,
            numeroOT,
            fechaDeteccion,
            lineaMetro,
            viaAfectada,
            ubicacionFallo,
            puntoKilometrico,
            coordenadasLat,
            coordenadasLng,
            tipoSensor,
            idActivo,
            mensajeAlarma,
            sintomaOperacional,
            severidad,
            tecnicoNombre,
            tecnicoId,
            tecnicoEspecialidad,
            horaLlegada,
            diagnosticoPreliminar,
            accionesIntervencion,
            componenteReemplazado,
            componenteNuevoId,
            pruebasRealizadas,
            notasPruebas,
            impactoMinutos,
            trenesAfectados,
            observaciones,
            recomendaciones,
            fotosAdjuntas,
            tiempoTotalSegundos,
            tiempoTotalFormato,
            reporteTexto
        } = req.body;

        console.log(`📄 Guardando reporte final para evento ${eventoId}`);

        const result = await pool.query(`
            INSERT INTO reporteFinal (
                evento_id, numero_ot, fecha_deteccion, linea_metro, via_afectada,
                ubicacion_fallo, punto_kilometrico, coordenadas_lat, coordenadas_lng,
                tipo_sensor, id_activo, mensaje_alarma, sintoma_operacional, severidad,
                tecnico_nombre, tecnico_id, tecnico_especialidad, hora_llegada,
                diagnostico_preliminar, acciones_intervencion, componente_reemplazado,
                componente_nuevo_id, pruebas_realizadas, notas_pruebas,
                impacto_minutos, trenes_afectados, observaciones, recomendaciones,
                fotos_adjuntas, tiempo_total_atencion_segundos, tiempo_total_atencion_formato,
                reporte_texto
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                $31, $32
            ) RETURNING id
        `, [
            eventoId, numeroOT, fechaDeteccion, lineaMetro, viaAfectada,
            ubicacionFallo, puntoKilometrico, coordenadasLat, coordenadasLng,
            tipoSensor, idActivo, mensajeAlarma, sintomaOperacional, severidad,
            tecnicoNombre, tecnicoId, tecnicoEspecialidad, horaLlegada,
            diagnosticoPreliminar, accionesIntervencion, componenteReemplazado,
            componenteNuevoId, pruebasRealizadas, notasPruebas,
            impactoMinutos, trenesAfectados, observaciones, recomendaciones,
            fotosAdjuntas, tiempoTotalSegundos, tiempoTotalFormato,
            reporteTexto
        ]);

        console.log(`✅ Reporte guardado con ID: ${result.rows[0].id}`);
        res.json({ id: result.rows[0].id, message: 'Reporte guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar reporte:', error);
        res.status(500).json({ error: 'Error al guardar reporte final' });
    }
});

// Endpoint para obtener eventos finalizados (historial)
app.get('/api/eventos/finalizados', async (req, res) => {
    try {
        const limit = req.query.limit || 50;

        const result = await pool.query(`
            SELECT 
                e.id as ticket_id,
                e.timestamp,
                e.id_sensor,
                e.severidad,
                e.estampa_asignacion,
                e.estampa_finalizacion,
                e.tiempo_atencion_minutos
            FROM evento e
            WHERE e.estampa_finalizacion IS NOT NULL
            ORDER BY e.estampa_finalizacion DESC
            LIMIT $1
        `, [limit]);

        // Enriquecer con datos del sensor
        const eventosEnriquecidos = [];

        for (const evento of result.rows) {
            if (!evento.id_sensor) {
                continue;
            }

            const sensorResult = await pool.query(
                'SELECT sensor_id, linea, lat, lon FROM sensores WHERE sensor_id = $1 LIMIT 1',
                [evento.id_sensor]
            );

            if (sensorResult.rows.length === 0) {
                continue;
            }

            const sensor = sensorResult.rows[0];

            eventosEnriquecidos.push({
                ticketId: evento.ticket_id,
                timestamp: evento.timestamp,
                sensorId: sensor.sensor_id,
                linea: sensor.linea,
                lat: sensor.lat,
                lng: sensor.lon,
                severidad: evento.severidad,
                estampaAsignacion: evento.estampa_asignacion,
                estampaFinalizacion: evento.estampa_finalizacion,
                tiempoAtencionMinutos: evento.tiempo_atencion_minutos
            });
        }

        console.log(`📊 Eventos finalizados encontrados: ${eventosEnriquecidos.length}`);
        res.json(eventosEnriquecidos);
    } catch (error) {
        console.error('Error al obtener eventos finalizados:', error);
        res.status(500).json({ error: 'Error al obtener eventos finalizados' });
    }
});

// Endpoint para obtener técnicos cercanos con distancias y tiempos reales
app.post('/api/tecnicos/cercanos', async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Se requieren coordenadas lat y lng' });
        }

        console.log(`🔍 Buscando técnicos cercanos a: ${lat}, ${lng}`);

        // Obtener todos los técnicos disponibles
        const result = await pool.query(
            'SELECT * FROM tecnicos WHERE disponible = true ORDER BY id'
        );

        if (result.rows.length === 0) {
            return res.json([]);
        }

        // Construir origins y destinations para Google Distance Matrix API
        const destination = `${lat},${lng}`;
        const origins = result.rows.map(t => `${t.lat},${t.lon}`).join('|');

        // Llamar a Google Distance Matrix API
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destination}&mode=driving&departure_time=now&traffic_model=best_guess&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            console.error('Error en Google API:', data.status);
            return res.status(500).json({ error: 'Error al calcular distancias' });
        }

        // Combinar datos de técnicos con distancias/tiempos reales
        const tecnicosConDistancias = result.rows.map((tecnico, index) => {
            const element = data.rows[index].elements[0];

            if (element.status === 'OK') {
                return {
                    id: tecnico.id,
                    nombre: tecnico.nombre,
                    especialidad: tecnico.especialidad,
                    experiencia: tecnico.experiencia,
                    telefono: tecnico.telefono,
                    ubicacion: {
                        lat: parseFloat(tecnico.lat),
                        lng: parseFloat(tecnico.lon)
                    },
                    distancia: element.distance.text,
                    distanciaMetros: element.distance.value,
                    tiempoEstimado: element.duration.text,
                    tiempoEstimadoSegundos: element.duration.value,
                    tiempoConTrafico: element.duration_in_traffic ? element.duration_in_traffic.text : element.duration.text,
                    tiempoConTraficoSegundos: element.duration_in_traffic ? element.duration_in_traffic.value : element.duration.value
                };
            }
            return null;
        }).filter(t => t !== null);

        // Ordenar por distancia (más cercano primero)
        tecnicosConDistancias.sort((a, b) => a.distanciaMetros - b.distanciaMetros);

        console.log(`✅ Encontrados ${tecnicosConDistancias.length} técnicos disponibles`);
        console.log(`   Más cercano: ${tecnicosConDistancias[0].nombre} - ${tecnicosConDistancias[0].distancia} (${tecnicosConDistancias[0].tiempoConTrafico})`);

        res.json(tecnicosConDistancias);
    } catch (error) {
        console.error('Error al buscar técnicos cercanos:', error);
        res.status(500).json({ error: 'Error al buscar técnicos cercanos' });
    }
});

// Endpoint para asignar técnico a un evento
app.patch('/api/eventos/:id/asignar-tecnico', async (req, res) => {
    try {
        const { id } = req.params;
        const { tecnicoId } = req.body;

        console.log(`👤 Asignando técnico ${tecnicoId} al evento ${id}`);

        // Actualizar evento con estampa_asignacion
        const result = await pool.query(
            'UPDATE evento SET estampa_asignacion = NOW() WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        // Marcar técnico como ocupado
        await pool.query(
            'UPDATE tecnicos SET disponible = false WHERE id = $1',
            [tecnicoId]
        );

        console.log(`✅ Técnico asignado exitosamente`);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al asignar técnico:', error);
        res.status(500).json({ error: 'Error al asignar técnico' });
    }
});

// Endpoint para liberar técnico cuando finaliza un evento
app.patch('/api/tecnicos/:id/liberar', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'UPDATE tecnicos SET disponible = true WHERE id = $1',
            [id]
        );

        console.log(`✅ Técnico ${id} liberado y disponible`);
        res.json({ message: 'Técnico liberado exitosamente' });
    } catch (error) {
        console.error('Error al liberar técnico:', error);
        res.status(500).json({ error: 'Error al liberar técnico' });
    }
});

// Endpoint para enviar reporte por correo
app.post('/api/reportes/enviar-correo', async (req, res) => {
    try {
        const { reporteId, destinatarios } = req.body;

        if (!reporteId || !destinatarios) {
            return res.status(400).json({
                error: 'Se requiere reporteId y destinatarios'
            });
        }

        console.log(`📧 Enviando reporte ${reporteId} por correo...`);

        // Obtener reporte de la base de datos
        const result = await pool.query(
            'SELECT * FROM reporteFinal WHERE id = $1',
            [reporteId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }

        const reporte = result.rows[0];

        // Enviar correo
        const resultado = await enviarReportePorCorreo(reporte, destinatarios);

        console.log(`✅ Reporte enviado a: ${resultado.destinatarios}`);

        res.json({
            success: true,
            message: 'Reporte enviado exitosamente',
            messageId: resultado.messageId,
            destinatarios: resultado.destinatarios
        });

    } catch (error) {
        console.error('Error al enviar reporte por correo:', error);
        res.status(500).json({
            error: 'Error al enviar reporte por correo',
            details: error.message
        });
    }
});

// Endpoint para enviar reporte directamente (sin guardar en BD primero)
app.post('/api/reportes/enviar-correo-directo', async (req, res) => {
    try {
        const { reporte, destinatarios } = req.body;

        if (!reporte || !destinatarios) {
            return res.status(400).json({
                error: 'Se requiere reporte y destinatarios'
            });
        }

        console.log(`📧 Enviando reporte ${reporte.numeroOT} por correo...`);

        // Enviar correo directamente
        const resultado = await enviarReportePorCorreo(reporte, destinatarios);

        console.log(`✅ Reporte enviado a: ${resultado.destinatarios}`);

        res.json({
            success: true,
            message: 'Reporte enviado exitosamente',
            messageId: resultado.messageId,
            destinatarios: resultado.destinatarios
        });

    } catch (error) {
        console.error('Error al enviar reporte por correo:', error);
        res.status(500).json({
            error: 'Error al enviar reporte por correo',
            details: error.message
        });
    }
});

// Endpoint para verificar configuración de correo
app.get('/api/email/verificar', async (_req, res) => {
    try {
        const configurado = await verificarConfiguracionCorreo();
        res.json({
            configurado,
            message: configurado
                ? 'Configuración de correo OK'
                : 'Configuración de correo no disponible'
        });
    } catch (error) {
        res.status(500).json({
            configurado: false,
            error: error.message
        });
    }
});

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ Conectado a PostgreSQL`);
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('❌ Error al iniciar servidor:', err);
    process.exit(1);
});

// Manejar errores no capturados
process.on('uncaughtException', (err) => {
    console.error('❌ Error no capturado:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Promesa rechazada:', err);
    process.exit(1);
});
