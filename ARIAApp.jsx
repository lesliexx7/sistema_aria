import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertTriangle, CheckCircle, Wrench, User, FileText, Timer, Camera, QrCode, ChevronDown, ChevronUp, Sparkles, Train, Gauge, Hash, Radio, Zap, RefreshCw, BarChart3, LogOut } from 'lucide-react';
import { getRandomSensor, METRO_LINES } from './sensorsData.js';
import { encontrarTecnicoCercano } from './technicianData.js';
import Dashboard from './Dashboard.jsx';
import { fetchEventosPendientes, actualizarEstadoEvento, finalizarEvento, guardarReporteFinal, obtenerTecnicosCercanos, asignarTecnicoAEvento, liberarTecnico, enviarReportePorCorreoDirecto } from './src/services/api.js';

const STATUS = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-500', icon: AlertTriangle },
    EN_ROUTE: { label: 'En Camino', color: 'bg-blue-500', icon: Navigation },
    ON_SITE: { label: 'En Sitio', color: 'bg-purple-500', icon: MapPin },
    WORKING: { label: 'Reparando', color: 'bg-orange-500', icon: Wrench },
    RESOLVED: { label: 'Resuelto', color: 'bg-green-500', icon: CheckCircle }
};

// Generar datos iniciales con sensor aleatorio real
const generateInitialData = () => {
    const sensor = getRandomSensor();
    const lineaInfo = METRO_LINES[sensor.linea];

    // Encontrar técnico más cercano al fallo
    const tecnicoCercano = encontrarTecnicoCercano({ lat: sensor.lat, lng: sensor.lng });

    return {
        reporte: {
            numeroOT: `OT-2025-1122-${Math.floor(Math.random() * 9000) + 1000}`,
            fechaHoraDeteccion: new Date().toLocaleString('es-MX'),
        },
        ubicacion: {
            lineaMetro: `Línea ${sensor.linea}`,
            lineaNombre: lineaInfo.nombre,
            viaAfectada: 'Vía 1 (Ascendente)',
            ubicacionFallo: `Sensor ${sensor.id}`,
            puntoKilometrico: `PK ${sensor.pk}`,
            coordenadas: { lat: sensor.lat, lng: sensor.lng }
        },
        activo: {
            tipoSensor: 'Contador de Ejes',
            idActivo: sensor.id,
            mensajeAlarma: 'Sensor X - Time-Out de Comunicación',
        },
        tecnico: {
            nombre: tecnicoCercano.nombre,
            idEmpleado: tecnicoCercano.id,
            especialidad: tecnicoCercano.especialidad,
            distancia: tecnicoCercano.distancia,
            tiempoEstimado: tecnicoCercano.tiempoEstimado,
            ubicacion: tecnicoCercano.ubicacion,
            horaLlegada: null,
        }
    };
};

const SEVERITY_OPTIONS = [
    { value: 'critico', label: 'Crítico', color: 'bg-red-500', desc: 'Interrupción total' },
    { value: 'alto', label: 'Alto', color: 'bg-orange-500', desc: 'Retrasos significativos' },
    { value: 'medio', label: 'Medio', color: 'bg-yellow-500', desc: 'Afectación menor' },
    { value: 'bajo', label: 'Bajo', color: 'bg-green-500', desc: 'Sin impacto operativo' },
];

const PRUEBAS_CHECKLIST = [
    { id: 'paso_tren', label: 'Test de paso de tren exitoso' },
    { id: 'lectura_params', label: 'Lectura de parámetros OK' },
    { id: 'comunicacion', label: 'Comunicación con centro de control OK' },
    { id: 'señalizacion', label: 'Señalización operando correctamente' },
];

// Componente de Google Maps con navegación
const GoogleMapComponent = ({ destination, currentStatus }) => {
    const mapRef = React.useRef(null);
    const mapInstanceRef = React.useRef(null);
    const faultMarkerRef = React.useRef(null);
    const technicianMarkerRef = React.useRef(null);
    const directionsRendererRef = React.useRef(null);
    const [routeInfo, setRouteInfo] = React.useState(null);

    React.useEffect(() => {
        const loadGoogleMaps = () => {
            if (window.google) {
                initMap();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC7NXQukGGQtFCZaSNz_KbYL5PD68825oo&libraries=geometry,places,visualization&language=es&region=MX`;
            script.async = true;
            script.defer = true;
            script.onload = initMap;
            document.head.appendChild(script);
        };

        const initMap = () => {
            if (!mapRef.current || !window.google) return;

            const map = new window.google.maps.Map(mapRef.current, {
                center: destination,
                zoom: 15,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                mapTypeId: 'roadmap',
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                    }
                ]
            });

            mapInstanceRef.current = map;

            // Activar capa de tráfico en tiempo real
            const trafficLayer = new window.google.maps.TrafficLayer();
            trafficLayer.setMap(map);

            // Marcador del fallo (sensor)
            faultMarkerRef.current = new window.google.maps.Marker({
                position: destination,
                map: map,
                title: 'Ubicación del Fallo',
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 15,
                    fillColor: '#EF4444',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 3,
                },
                animation: null, // Sin animación para evitar que brinque
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `<div style="color: black; padding: 8px;">
                    <strong>🚨 Fallo Detectado</strong><br/>
                    <strong>Sensor:</strong> ${destination.sensorId || 'N/A'}<br/>
                    <strong>Coordenadas:</strong> ${destination.lat.toFixed(5)}, ${destination.lng.toFixed(5)}
                </div>`
            });

            faultMarkerRef.current.addListener('click', () => {
                infoWindow.open(map, faultMarkerRef.current);
            });

            // Si el técnico está en camino, mostrar ruta
            if (currentStatus === 'EN_ROUTE') {
                simulateTechnicianRoute(map);
            }
        };

        const simulateTechnicianRoute = (map) => {
            // Posición simulada del técnico (base de operaciones - ejemplo: cerca del Zócalo)
            const technicianStart = {
                lat: 19.4326,
                lng: -99.1332
            };

            // Marcador del técnico
            technicianMarkerRef.current = new window.google.maps.Marker({
                position: technicianStart,
                map: map,
                title: 'Técnico en Camino',
                icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 7,
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                    rotation: 0
                },
            });

            // Calcular ruta con Directions API
            const directionsService = new window.google.maps.DirectionsService();
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#3B82F6',
                    strokeWeight: 5,
                    strokeOpacity: 0.8
                }
            });

            directionsService.route({
                origin: technicianStart,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
                drivingOptions: {
                    departureTime: new Date(),
                    trafficModel: 'bestguess'
                },
                provideRouteAlternatives: true,
                optimizeWaypoints: true
            }, (result, status) => {
                if (status === 'OK' && result.routes.length > 0) {
                    // Usar la ruta más rápida (primera ruta)
                    directionsRendererRef.current.setDirections(result);

                    const route = result.routes[0];
                    const leg = route.legs[0];

                    // Calcular diferencia de tiempo por tráfico
                    const durationNormal = leg.duration.value; // en segundos
                    const durationTraffic = leg.duration_in_traffic ? leg.duration_in_traffic.value : durationNormal;
                    const trafficDelay = Math.round((durationTraffic - durationNormal) / 60); // en minutos

                    setRouteInfo({
                        distance: leg.distance.text,
                        duration: leg.duration.text,
                        durationInTraffic: leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text,
                        trafficDelay: trafficDelay,
                        trafficCondition: trafficDelay > 10 ? 'Tráfico Pesado' : trafficDelay > 5 ? 'Tráfico Moderado' : 'Tráfico Fluido'
                    });
                }
            });
        };

        loadGoogleMaps();

        return () => {
            if (faultMarkerRef.current) faultMarkerRef.current.setMap(null);
            if (technicianMarkerRef.current) technicianMarkerRef.current.setMap(null);
            if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
        };
    }, [destination, currentStatus]);

    return (
        <div className="relative bg-gray-800 rounded-xl overflow-hidden">
            <div ref={mapRef} className="w-full h-64" />

            {currentStatus === 'EN_ROUTE' && routeInfo && (
                <div className="absolute top-2 left-2 bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-3 rounded-xl text-xs font-bold shadow-2xl border border-blue-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-5 h-5 animate-pulse" />
                        <span className="text-sm">Técnico en Camino</span>
                    </div>
                    <div className="text-white space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-blue-200">📏 Distancia:</span>
                            <span className="font-bold">{routeInfo.distance}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-blue-200">⏱️ Tiempo:</span>
                            <span className="font-bold">{routeInfo.durationInTraffic}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-blue-200">🚦 Tráfico:</span>
                            <span className={`font-bold ${routeInfo.trafficDelay > 10 ? 'text-red-300' :
                                routeInfo.trafficDelay > 5 ? 'text-yellow-300' :
                                    'text-green-300'
                                }`}>
                                {routeInfo.trafficCondition}
                            </span>
                        </div>
                        {routeInfo.trafficDelay > 0 && (
                            <div className="text-xs text-yellow-200 mt-1 pt-1 border-t border-blue-400/30">
                                +{routeInfo.trafficDelay} min por tráfico
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Leyenda de Tráfico */}
            <div className="absolute top-2 right-2 bg-black/70 px-3 py-2 rounded-lg text-xs">
                <div className="text-white font-semibold mb-1">Tráfico en Tiempo Real</div>
                <div className="space-y-0.5 text-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-green-500"></div>
                        <span>Fluido</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-yellow-500"></div>
                        <span>Moderado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-red-500"></div>
                        <span>Pesado</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-2 left-2 bg-black/80 px-3 py-2 rounded-lg text-xs">
                <div className="text-white font-semibold mb-1">Ubicación del Fallo</div>
                <div className="text-gray-300 space-y-0.5">
                    <div>📍 Lat: {destination.lat.toFixed(6)}</div>
                    <div>📍 Lng: {destination.lng.toFixed(6)}</div>
                    <div className="text-blue-400 mt-1">🔴 Georeferenciado</div>
                </div>
            </div>
        </div>
    );
};

export default function ARIAApp({ mode = 'admin', tecnicoId = null, falloInicial = null, onLogout = null }) {
    const [showDashboard, setShowDashboard] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('PENDING');
    const [activeTab, setActiveTab] = useState('fault');
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const [autoData, setAutoData] = useState(null);
    const [generatedReport, setGeneratedReport] = useState('');
    const [eventosPendientes, setEventosPendientes] = useState([]);
    const [loadingEventos, setLoadingEventos] = useState(false);
    const [tecnicosCercanos, setTecnicosCercanos] = useState([]);
    const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);
    const [mostrarSeleccionTecnico, setMostrarSeleccionTecnico] = useState(false);

    // Función para simular nueva falla con sensor aleatorio
    const generateNewFault = () => {
        setAutoData(generateInitialData());
        setCurrentStatus('PENDING');
        setTimer(0);
        setTimerActive(false);
        setGeneratedReport('');
        setFormData({
            sintomaOperacional: '',
            severidad: '',
            diagnosticoPreliminar: '',
            accionesIntervencion: '',
            componenteReemplazado: '',
            componenteNuevoId: '',
            pruebasRealizadas: [],
            notasPruebas: '',
            impactoMinutos: '',
            trenesAfectados: '',
            observaciones: '',
            recomendaciones: '',
            fotos: []
        });
    };

    const [formData, setFormData] = useState({
        sintomaOperacional: '',
        severidad: '',
        diagnosticoPreliminar: '',
        accionesIntervencion: '',
        componenteReemplazado: '',
        componenteNuevoId: '',
        pruebasRealizadas: [],
        notasPruebas: '',
        impactoMinutos: '',
        trenesAfectados: '',
        observaciones: '',
        recomendaciones: '',
        fotos: []
    });

    // Cargar eventos pendientes desde el backend
    useEffect(() => {
        const cargarEventos = async () => {
            setLoadingEventos(true);
            try {
                const eventos = await fetchEventosPendientes();
                setEventosPendientes(eventos);

                // NO cargar automáticamente ningún evento
                // El usuario debe seleccionar manualmente el ticket que quiere atender
            } catch (error) {
                console.error('Error al cargar eventos:', error);
                // No hacer nada, solo mostrar la lista vacía
            } finally {
                setLoadingEventos(false);
            }
        };

        cargarEventos();
        // Recargar cada 30 segundos
        const interval = setInterval(cargarEventos, 30000);
        return () => clearInterval(interval);
    }, []);

    // Función para cargar un evento del backend en el sistema
    const cargarEventoEnSistema = async (evento) => {
        const lineaInfo = METRO_LINES[evento.linea];

        // Obtener técnicos cercanos reales usando Google Distance Matrix API
        try {
            const tecnicos = await obtenerTecnicosCercanos(evento.lat, evento.lng);
            setTecnicosCercanos(tecnicos);

            if (tecnicos.length > 0) {
                // Mostrar modal de selección de técnico
                setMostrarSeleccionTecnico(true);

                // Preparar datos del evento (sin técnico asignado aún)
                const nuevoFallo = {
                    reporte: {
                        numeroOT: `OT-${evento.ticketId}`,
                        fechaHoraDeteccion: new Date(evento.timestamp).toLocaleString('es-MX'),
                    },
                    ubicacion: {
                        lineaMetro: `Línea ${evento.linea}`,
                        lineaNombre: lineaInfo.nombre,
                        viaAfectada: 'Vía 1 (Ascendente)',
                        ubicacionFallo: `Sensor ${evento.sensorId}`,
                        puntoKilometrico: 'N/A',
                        coordenadas: { lat: evento.lat, lng: evento.lng }
                    },
                    activo: {
                        tipoSensor: 'Contador de Ejes',
                        idActivo: evento.sensorId,
                        mensajeAlarma: 'Sensor X - Time-Out de Comunicación',
                    },
                    tecnico: null, // Se asignará cuando se seleccione
                    ticketId: evento.ticketId
                };

                setAutoData(nuevoFallo);
                setCurrentStatus('PENDING');
                setTimer(0);
                setTimerActive(false); // No iniciar timer hasta que se asigne técnico
            }
        } catch (error) {
            console.error('Error al obtener técnicos cercanos:', error);
            alert('Error al buscar técnicos disponibles');
        }
    };

    // Función para asignar técnico seleccionado
    const asignarTecnico = async (tecnico) => {
        try {
            // Asignar técnico al evento en el backend
            await asignarTecnicoAEvento(autoData.ticketId, tecnico.id);

            // Actualizar datos locales
            setAutoData(prev => ({
                ...prev,
                tecnico: {
                    nombre: tecnico.nombre,
                    idEmpleado: tecnico.id,
                    especialidad: tecnico.especialidad,
                    distancia: tecnico.distancia,
                    tiempoEstimado: tecnico.tiempoConTrafico,
                    ubicacion: tecnico.ubicacion,
                    horaLlegada: null,
                }
            }));

            setTecnicoSeleccionado(tecnico);
            setMostrarSeleccionTecnico(false);
            setTimerActive(true); // Iniciar timer cuando se asigna técnico

            console.log(`✅ Técnico ${tecnico.nombre} asignado al evento ${autoData.ticketId}`);
        } catch (error) {
            console.error('Error al asignar técnico:', error);
            alert('Error al asignar técnico');
        }
    };

    useEffect(() => {
        let interval;
        if (timerActive && currentStatus !== 'RESOLVED') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, currentStatus]);

    useEffect(() => {
        if (currentStatus === 'ON_SITE' && !autoData.tecnico.horaLlegada) {
            setAutoData(prev => ({
                ...prev,
                tecnico: { ...prev.tecnico, horaLlegada: new Date().toLocaleString('es-MX') }
            }));
        }
    }, [currentStatus, autoData?.tecnico?.horaLlegada]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStatusChange = async (newStatus) => {
        // Validar flujo secuencial de estados
        const statusOrder = ['PENDING', 'EN_ROUTE', 'ON_SITE', 'WORKING', 'RESOLVED'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const newIndex = statusOrder.indexOf(newStatus);

        // Solo permitir avanzar al siguiente estado o retroceder
        if (newIndex > currentIndex + 1) {
            alert('Debes completar los estados en orden: Pendiente → En Camino → En Sitio → Reparando → Resuelto');
            return;
        }

        setCurrentStatus(newStatus);
        if (newStatus === 'EN_ROUTE' && !timerActive) setTimerActive(true);

        // Cambiar a tab de reporte cuando esté reparando
        if (newStatus === 'WORKING') {
            setActiveTab('report');
        }

        // Actualizar estado en el backend si hay ticketId
        if (autoData.ticketId) {
            try {
                const estadoBackend = newStatus.toLowerCase().replace('_', '-');

                // Si cambia a "en-route" (En Camino), guardar estampa_asignacion
                if (estadoBackend === 'en-route') {
                    await actualizarEstadoEvento(autoData.ticketId, estadoBackend, null);
                    console.log(`✅ Técnico en camino - Estado: ${estadoBackend}`);
                } else {
                    // Para otros estados, no enviar severidad
                    await actualizarEstadoEvento(autoData.ticketId, estadoBackend, null);
                    console.log(`✅ Estado actualizado en DB: ${estadoBackend}`);
                }
            } catch (error) {
                console.error('Error al actualizar estado en backend:', error);
            }
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheckbox = (id) => {
        setFormData(prev => ({
            ...prev,
            pruebasRealizadas: prev.pruebasRealizadas.includes(id)
                ? prev.pruebasRealizadas.filter(p => p !== id)
                : [...prev.pruebasRealizadas, id]
        }));
    };

    const handlePhotoCapture = () => {
        const mockPhoto = `foto_${Date.now()}.jpg`;
        setFormData(prev => ({ ...prev, fotos: [...prev.fotos, mockPhoto] }));
    };

    const generateReport = () => {
        // Validar que la severidad esté seleccionada (obligatorio después de "En Camino")
        if (!formData.severidad) {
            alert('⚠️ Debes seleccionar la SEVERIDAD del fallo en el formulario antes de generar el reporte.');
            return;
        }

        const severidadLabel = SEVERITY_OPTIONS.find(s => s.value === formData.severidad)?.label || 'No especificada';
        const pruebasTexto = formData.pruebasRealizadas
            .map(id => PRUEBAS_CHECKLIST.find(p => p.id === id)?.label)
            .join('\n    • ') || 'No registradas';

        const report = `════════════════════════════════════════════════════════════
REPORTE DE INCIDENCIA
Sistema ARIA - Siemens Mobility México
════════════════════════════════════════════════════════════

I. IDENTIFICACIÓN DEL EVENTO
────────────────────────────────────────────────────────────
Número de Reporte (OT):    ${autoData.reporte.numeroOT}
Fecha/Hora Detección:      ${autoData.reporte.fechaHoraDeteccion}
Línea de Metro:            ${autoData.ubicacion.lineaMetro}
Vía Afectada:              ${autoData.ubicacion.viaAfectada}
Ubicación del Fallo:       ${autoData.ubicacion.ubicacionFallo}
Punto Kilométrico:         ${autoData.ubicacion.puntoKilometrico}

II. DETALLES DEL ACTIVO Y FALLO
────────────────────────────────────────────────────────────
Tipo de Sensor:            ${autoData.activo.tipoSensor}
ID del Activo:             ${autoData.activo.idActivo}
Mensaje de Alarma:         ${autoData.activo.mensajeAlarma}
Síntoma Operacional:       ${formData.sintomaOperacional || 'No especificado'}
Severidad:                 ${severidadLabel}

III. GESTIÓN DEL MANTENIMIENTO
────────────────────────────────────────────────────────────
Técnico Asignado:          ${autoData.tecnico.nombre}
ID Empleado:               ${autoData.tecnico.idEmpleado}
Hora de Llegada:           ${autoData.tecnico.horaLlegada || 'Pendiente'}
Diagnóstico Preliminar:    ${formData.diagnosticoPreliminar || 'No especificado'}

IV. ACCIONES Y RESOLUCIÓN
────────────────────────────────────────────────────────────
Acciones Realizadas:
${formData.accionesIntervencion || 'No especificadas'}

Componente Reemplazado:    ${formData.componenteReemplazado || 'Ninguno'}
ID Componente Nuevo:       ${formData.componenteNuevoId || 'N/A'}

Pruebas de Funcionalidad:
    • ${pruebasTexto}

Notas de Pruebas:          ${formData.notasPruebas || 'Sin notas'}
Hora Puesta en Servicio:   ${currentStatus === 'RESOLVED' ? new Date().toLocaleString('es-MX') : 'Pendiente'}

V. OBSERVACIONES Y RECOMENDACIONES
────────────────────────────────────────────────────────────
Impacto Operacional:       ${formData.impactoMinutos || '0'} minutos de retraso
                           ${formData.trenesAfectados || '0'} trenes afectados

Observaciones:
${formData.observaciones || 'Sin observaciones'}

Recomendaciones:
${formData.recomendaciones || 'Sin recomendaciones'}

Evidencia Fotográfica:     ${formData.fotos.length} archivo(s) adjunto(s)

════════════════════════════════════════════════════════════
Tiempo Total de Atención:  ${formatTime(timer)}
Generado por:              ARIA - Agente de Respuesta Inteligente
Destino:                   C5 CDMX | Siemens Mobility
════════════════════════════════════════════════════════════`;

        setGeneratedReport(report);
        setActiveTab('preview');

        // Mostrar mensaje de éxito
        setTimeout(() => {
            alert('✅ Reporte generado exitosamente. Revisa la vista previa y presiona "Finalizar" para completar el caso.');
        }, 300);
    };

    // Guardar fallo completado en localStorage para el dashboard
    const guardarFalloCompletado = () => {
        const fallosGuardados = JSON.parse(localStorage.getItem('fallosCompletados') || '[]');
        const nuevoFallo = {
            id: autoData.reporte.numeroOT,
            fecha: new Date().toISOString(),
            sensor: autoData.activo.idActivo,
            linea: autoData.ubicacion.lineaMetro,
            lineaNombre: autoData.ubicacion.lineaNombre,
            tipoSensor: autoData.activo.tipoSensor,
            severidad: formData.severidad,
            tiempoAtencion: timer,
            impactoMinutos: parseInt(formData.impactoMinutos) || 0,
            trenesAfectados: parseInt(formData.trenesAfectados) || 0,
            tecnico: autoData.tecnico.nombre
        };
        fallosGuardados.push(nuevoFallo);
        localStorage.setItem('fallosCompletados', JSON.stringify(fallosGuardados));
    };

    const finalizarCaso = async () => {
        // Guardar el fallo en el historial
        guardarFalloCompletado();

        // Marcar como resuelto
        setCurrentStatus('RESOLVED');

        // Finalizar evento en el backend si hay ticketId
        if (autoData.ticketId) {
            try {
                const tiempoMinutos = Math.floor(timer / 60);

                // 1. Finalizar el evento (actualizar timestamps)
                await finalizarEvento(autoData.ticketId, generatedReport, tiempoMinutos, formData.severidad);

                // 2. Liberar técnico para que esté disponible nuevamente
                if (tecnicoSeleccionado) {
                    await liberarTecnico(tecnicoSeleccionado.id);
                    console.log(`✅ Técnico ${tecnicoSeleccionado.nombre} liberado`);
                }

                // 3. Guardar el reporte completo en la tabla reporteFinal
                const reporteData = {
                    eventoId: autoData.ticketId,
                    numeroOT: autoData.reporte.numeroOT,
                    fechaDeteccion: autoData.reporte.fechaHoraDeteccion,
                    lineaMetro: autoData.ubicacion.lineaMetro,
                    viaAfectada: autoData.ubicacion.viaAfectada,
                    ubicacionFallo: autoData.ubicacion.ubicacionFallo,
                    puntoKilometrico: autoData.ubicacion.puntoKilometrico,
                    coordenadasLat: autoData.ubicacion.coordenadas.lat,
                    coordenadasLng: autoData.ubicacion.coordenadas.lng,
                    tipoSensor: autoData.activo.tipoSensor,
                    idActivo: autoData.activo.idActivo,
                    mensajeAlarma: autoData.activo.mensajeAlarma,
                    sintomaOperacional: formData.sintomaOperacional,
                    severidad: formData.severidad,
                    tecnicoNombre: autoData.tecnico.nombre,
                    tecnicoId: autoData.tecnico.idEmpleado,
                    tecnicoEspecialidad: autoData.tecnico.especialidad,
                    horaLlegada: autoData.tecnico.horaLlegada,
                    diagnosticoPreliminar: formData.diagnosticoPreliminar,
                    accionesIntervencion: formData.accionesIntervencion,
                    componenteReemplazado: formData.componenteReemplazado,
                    componenteNuevoId: formData.componenteNuevoId,
                    pruebasRealizadas: formData.pruebasRealizadas,
                    notasPruebas: formData.notasPruebas,
                    impactoMinutos: parseInt(formData.impactoMinutos) || 0,
                    trenesAfectados: parseInt(formData.trenesAfectados) || 0,
                    observaciones: formData.observaciones,
                    recomendaciones: formData.recomendaciones,
                    fotosAdjuntas: formData.fotos.length,
                    tiempoTotalSegundos: timer,
                    tiempoTotalFormato: formatTime(timer),
                    reporteTexto: generatedReport
                };

                await guardarReporteFinal(reporteData);

                console.log(`✅ Evento ${autoData.ticketId} finalizado y reporte guardado`);
                console.log(`   - Tiempo total: ${tiempoMinutos} minutos (${formatTime(timer)})`);
                console.log(`   - Severidad: ${formData.severidad}`);

            } catch (error) {
                console.error('Error al finalizar evento en backend:', error);
            }
        }

        // Enviar reporte por correo automáticamente (siempre, incluso en modo simulación)
        try {
            console.log('📧 Enviando reporte por correo...');
            const destinatario = 'hernandez.nava@gmail.com';

            // Preparar datos del reporte para envío
            const reporteParaCorreo = {
                numeroOT: autoData.reporte.numeroOT,
                fechaDeteccion: autoData.reporte.fechaHoraDeteccion,
                lineaMetro: autoData.ubicacion.lineaMetro,
                viaAfectada: autoData.ubicacion.viaAfectada,
                ubicacionFallo: autoData.ubicacion.ubicacionFallo,
                puntoKilometrico: autoData.ubicacion.puntoKilometrico,
                coordenadasLat: autoData.ubicacion.coordenadas.lat,
                coordenadasLng: autoData.ubicacion.coordenadas.lng,
                tipoSensor: autoData.activo.tipoSensor,
                idActivo: autoData.activo.idActivo,
                mensajeAlarma: autoData.activo.mensajeAlarma,
                sintomaOperacional: formData.sintomaOperacional,
                severidad: formData.severidad,
                tecnicoNombre: autoData.tecnico.nombre,
                tecnicoId: autoData.tecnico.idEmpleado,
                tecnicoEspecialidad: autoData.tecnico.especialidad,
                horaLlegada: autoData.tecnico.horaLlegada,
                diagnosticoPreliminar: formData.diagnosticoPreliminar,
                accionesIntervencion: formData.accionesIntervencion,
                componenteReemplazado: formData.componenteReemplazado,
                componenteNuevoId: formData.componenteNuevoId,
                pruebasRealizadas: formData.pruebasRealizadas,
                notasPruebas: formData.notasPruebas,
                impactoMinutos: parseInt(formData.impactoMinutos) || 0,
                trenesAfectados: parseInt(formData.trenesAfectados) || 0,
                observaciones: formData.observaciones,
                recomendaciones: formData.recomendaciones,
                fotosAdjuntas: formData.fotos.length,
                tiempoTotalSegundos: timer,
                tiempoTotalFormato: formatTime(timer),
                reporteTexto: generatedReport
            };

            await enviarReportePorCorreoDirecto(reporteParaCorreo, destinatario);
            console.log('✅ Reporte enviado por correo exitosamente a:', destinatario);
        } catch (emailError) {
            console.error('⚠️ Error al enviar correo (no crítico):', emailError);
            console.error('Detalles del error:', emailError.message);
            // No bloqueamos el flujo si falla el correo
        }

        // Mostrar modal de éxito
        setShowSuccessModal(true);
    };

    const resetApp = () => {
        setShowSuccessModal(false);
        generateNewFault();
        setActiveTab('fault');
    };

    const AutoField = ({ label, value, icon: Icon }) => (
        <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <div className="flex items-center gap-2 text-gray-400">
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm font-medium text-green-400">{value}</span>
        </div>
    );

    const InputField = ({ label, field, placeholder, type = "text", min, icon: Icon }) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-blue-500' : 'bg-gray-600'}`}></span>
                    {label}
                </label>
                <div className={`relative rounded-xl transition-all duration-200 ${isFocused
                    ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                    : 'ring-1 ring-gray-600 hover:ring-gray-500'
                    }`}>
                    {Icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon className="w-4 h-4" />
                        </div>
                    )}
                    <input
                        type={type}
                        value={formData[field]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        min={min}
                        className={`w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 ${Icon ? 'pl-10' : ''} text-sm outline-none text-white placeholder-gray-500`}
                    />
                </div>
            </div>
        );
    };

    const TextField = ({ label, field, placeholder }) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const charCount = formData[field]?.length || 0;
        const maxChars = 500;

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-blue-500' : 'bg-gray-600'}`}></span>
                        {label}
                    </label>
                    <span className={`text-xs ${charCount > maxChars * 0.9 ? 'text-orange-400' : 'text-gray-500'}`}>
                        {charCount}/{maxChars}
                    </span>
                </div>
                <div className={`relative rounded-xl transition-all duration-200 ${isFocused
                    ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                    : 'ring-1 ring-gray-600 hover:ring-gray-500'
                    }`}>
                    <textarea
                        value={formData[field]}
                        onChange={(e) => {
                            if (e.target.value.length <= maxChars) {
                                setFormData(prev => ({ ...prev, [field]: e.target.value }));
                            }
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-sm resize-none h-32 outline-none text-white placeholder-gray-500 leading-relaxed"
                        style={{
                            backgroundImage: isFocused
                                ? 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(17, 24, 39))'
                                : 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(31, 41, 55))'
                        }}
                    />
                    {isFocused && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-400">Escribiendo...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const Section = ({ id, title, icon: Icon, children }) => (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button
                onClick={() => toggleSection(id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-750"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{title}</span>
                </div>
                {expandedSections[id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections[id] && <div className="p-4 pt-0 space-y-4">{children}</div>}
        </div>
    );

    // Si está mostrando el dashboard, renderizar solo eso
    if (showDashboard) {
        return <Dashboard onBack={() => setShowDashboard(false)} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">ARIA</h1>
                            <p className="text-xs text-purple-200">Agente de Respuesta Inteligente</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {mode === 'admin' && (
                            <>
                                <button
                                    onClick={() => setShowDashboard(true)}
                                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                                    title="Ver Dashboard"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={generateNewFault}
                                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                                    title="Simular nueva falla"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition text-sm"
                                title="Cerrar Sesión"
                            >
                                Salir
                            </button>
                        )}
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                            <Timer className="w-4 h-4" />
                            <span className="font-mono text-lg">{formatTime(timer)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Banner */}
            {autoData && (
                <div className={`${STATUS[currentStatus].color} p-3 flex items-center justify-center gap-2`}>
                    {React.createElement(STATUS[currentStatus].icon, { className: "w-5 h-5" })}
                    <span className="font-semibold">{STATUS[currentStatus].label}</span>
                    <span className="text-sm opacity-75">• {autoData.reporte.numeroOT}</span>
                </div>
            )}

            {/* Lista de Eventos Pendientes */}
            {mode === 'admin' && eventosPendientes.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 animate-pulse" />
                            <span className="font-semibold">Eventos Pendientes: {eventosPendientes.length}</span>
                        </div>
                        {loadingEventos && <RefreshCw className="w-4 h-4 animate-spin" />}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {eventosPendientes.slice(0, 5).map((evento) => (
                            <button
                                key={evento.ticketId}
                                onClick={() => cargarEventoEnSistema(evento)}
                                className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition"
                            >
                                <div className="font-bold">Ticket #{evento.ticketId}</div>
                                <div className="text-xs opacity-90">Línea {evento.linea} • {evento.sensorId}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Mensaje cuando no hay evento seleccionado */}
            {!autoData && eventosPendientes.length > 0 && (
                <div className="p-8 text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                    <h2 className="text-2xl font-bold mb-2">Selecciona un Evento Pendiente</h2>
                    <p className="text-gray-400">Haz click en uno de los tickets arriba para comenzar a trabajar</p>
                </div>
            )}

            {/* Mensaje cuando no hay eventos */}
            {!autoData && eventosPendientes.length === 0 && !loadingEventos && (
                <div className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h2 className="text-2xl font-bold mb-2">No hay Eventos Pendientes</h2>
                    <p className="text-gray-400">Todos los eventos han sido atendidos</p>
                </div>
            )}

            {/* Tabs - Solo mostrar cuando hay un evento cargado */}
            {autoData && (
                <div className="p-4">
                    <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
                        {[
                            { id: 'fault', label: 'Falla', enabled: true },
                            { id: 'report', label: 'Reporte', enabled: currentStatus === 'WORKING' || currentStatus === 'RESOLVED' },
                            { id: 'preview', label: 'Vista Previa', enabled: generatedReport !== '' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => tab.enabled && setActiveTab(tab.id)}
                                disabled={!tab.enabled}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : tab.enabled
                                        ? 'text-gray-400 hover:text-white'
                                        : 'text-gray-600 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                {tab.label}
                                {!tab.enabled && tab.id === 'report' && ' 🔒'}
                                {!tab.enabled && tab.id === 'preview' && ' 🔒'}
                            </button>
                        ))}
                    </div>

                    {/* Tab: Falla */}
                    {activeTab === 'fault' && (
                        <div className="space-y-4">
                            {/* Mapa de Google Maps con navegación */}
                            <GoogleMapComponent
                                destination={{
                                    ...autoData.ubicacion.coordenadas,
                                    sensorId: autoData.activo.idActivo
                                }}
                                currentStatus={currentStatus}
                            />

                            <div className="bg-gray-800 rounded-xl p-4 space-y-2">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    {autoData.activo.tipoSensor}
                                </h3>
                                <p className="text-sm text-red-400 font-mono">{autoData.activo.mensajeAlarma}</p>
                                <AutoField label="ID Activo" value={autoData.activo.idActivo} icon={Hash} />
                                <AutoField label="Línea" value={`${autoData.ubicacion.lineaMetro} - ${autoData.ubicacion.lineaNombre}`} icon={Train} />
                                <AutoField label="Ubicación" value={autoData.ubicacion.ubicacionFallo} icon={MapPin} />
                                <AutoField label="PK" value={autoData.ubicacion.puntoKilometrico} icon={Gauge} />
                                <AutoField label="Vía" value={autoData.ubicacion.viaAfectada} icon={Radio} />
                            </div>

                            {/* Información del Técnico Asignado */}
                            {autoData.tecnico ? (
                                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                                        <User className="w-5 h-5 text-blue-400" />
                                        Técnico Asignado
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Nombre:</span>
                                            <span className="text-sm font-semibold text-white">{autoData.tecnico.nombre}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">ID:</span>
                                            <span className="text-sm font-mono text-blue-400">{autoData.tecnico.idEmpleado}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Especialidad:</span>
                                            <span className="text-sm text-white">{autoData.tecnico.especialidad}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Distancia:</span>
                                            <span className="text-sm font-semibold text-green-400">{autoData.tecnico.distancia}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Tiempo Estimado:</span>
                                            <span className="text-sm font-semibold text-yellow-400">{autoData.tecnico.tiempoEstimado}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
                                    <p className="text-yellow-400 text-sm flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Esperando asignación de técnico...
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-800 rounded-xl p-4">
                                <h4 className="text-sm text-gray-400 mb-3">Cambiar Estado</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(STATUS).map(([key, val]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleStatusChange(key)}
                                            className={`p-3 rounded-lg flex items-center justify-center gap-2 transition ${currentStatus === key
                                                ? `${val.color} text-white`
                                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                }`}
                                        >
                                            {React.createElement(val.icon, { className: "w-4 h-4" })}
                                            <span className="text-sm">{val.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Reporte */}
                    {activeTab === 'report' && (
                        <div className="space-y-3">
                            <Section id="identificacion" title="I. Identificación (Auto)" icon={FileText}>
                                <div className="bg-gray-700/50 rounded-lg p-3 space-y-1">
                                    <AutoField label="Número OT" value={autoData.reporte.numeroOT} icon={Hash} />
                                    <AutoField label="Fecha/Hora Detección" value={autoData.reporte.fechaHoraDeteccion} icon={Clock} />
                                    <AutoField label="Línea" value={autoData.ubicacion.lineaMetro} icon={Train} />
                                    <AutoField label="Vía" value={autoData.ubicacion.viaAfectada} icon={Radio} />
                                    <AutoField label="Ubicación" value={autoData.ubicacion.ubicacionFallo} icon={MapPin} />
                                    <AutoField label="PK" value={autoData.ubicacion.puntoKilometrico} icon={Gauge} />
                                </div>
                            </Section>

                            <Section id="activo" title="II. Detalles del Fallo" icon={Zap}>
                                <div className="bg-gray-700/50 rounded-lg p-3 space-y-1 mb-4">
                                    <AutoField label="Tipo Sensor" value={autoData.activo.tipoSensor} icon={Radio} />
                                    <AutoField label="ID Activo" value={autoData.activo.idActivo} icon={Hash} />
                                    <AutoField label="Mensaje Alarma" value={autoData.activo.mensajeAlarma} icon={AlertTriangle} />
                                </div>

                                <TextField
                                    label="Síntoma Operacional *"
                                    field="sintomaOperacional"
                                    placeholder="Describe qué ocurrió (señalización, trenes, etc.)"
                                />

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Severidad *</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SEVERITY_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setFormData(prev => ({ ...prev, severidad: opt.value }))}
                                                className={`p-3 rounded-lg text-left transition ${formData.severidad === opt.value
                                                    ? `${opt.color} text-white`
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <p className="font-semibold text-sm">{opt.label}</p>
                                                <p className="text-xs opacity-75">{opt.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            <Section id="gestion" title="III. Gestión (Auto + Manual)" icon={User}>
                                <div className="bg-gray-700/50 rounded-lg p-3 space-y-1 mb-4">
                                    <AutoField label="Técnico" value={autoData.tecnico.nombre} icon={User} />
                                    <AutoField label="ID Empleado" value={autoData.tecnico.idEmpleado} icon={Hash} />
                                    <AutoField
                                        label="Hora Llegada"
                                        value={autoData.tecnico.horaLlegada || 'Pendiente (auto al llegar)'}
                                        icon={Clock}
                                    />
                                </div>

                                <TextField
                                    label="Diagnóstico Preliminar *"
                                    field="diagnosticoPreliminar"
                                    placeholder="Causa presunta del fallo..."
                                />
                            </Section>

                            <Section id="acciones" title="IV. Acciones y Resolución" icon={Wrench}>
                                <TextField
                                    label="Acciones de Intervención *"
                                    field="accionesIntervencion"
                                    placeholder="Pasos realizados (1. Aislamiento, 2. Medición...)"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <InputField
                                        label="Componente Reemplazado"
                                        field="componenteReemplazado"
                                        placeholder="Ej: Módulo electrónico, Sensor, Cable..."
                                        icon={Wrench}
                                    />
                                    <InputField
                                        label="ID Componente Nuevo"
                                        field="componenteNuevoId"
                                        placeholder="Escanear o escribir ID"
                                        icon={Hash}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Pruebas de Funcionalidad</label>
                                    <div className="space-y-2">
                                        {PRUEBAS_CHECKLIST.map((prueba) => (
                                            <label
                                                key={prueba.id}
                                                className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.pruebasRealizadas.includes(prueba.id)}
                                                    onChange={() => handleCheckbox(prueba.id)}
                                                    className="w-5 h-5 rounded"
                                                />
                                                <span className="text-sm">{prueba.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.notasPruebas}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notasPruebas: e.target.value }))}
                                        placeholder="Notas adicionales de pruebas..."
                                        className="w-full bg-gray-700 rounded-lg p-3 text-sm"
                                    />
                                </div>
                            </Section>

                            <Section id="observaciones" title="V. Observaciones" icon={FileText}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Minutos de Retraso</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.impactoMinutos}
                                            onChange={(e) => {
                                                const value = Math.max(0, parseInt(e.target.value) || 0);
                                                setFormData(prev => ({ ...prev, impactoMinutos: value.toString() }));
                                            }}
                                            placeholder="0"
                                            className="w-full bg-gray-700 rounded-lg p-3 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Trenes Afectados</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.trenesAfectados}
                                            onChange={(e) => {
                                                const value = Math.max(0, parseInt(e.target.value) || 0);
                                                setFormData(prev => ({ ...prev, trenesAfectados: value.toString() }));
                                            }}
                                            placeholder="0"
                                            className="w-full bg-gray-700 rounded-lg p-3 text-sm"
                                        />
                                    </div>
                                </div>

                                <TextField
                                    label="Observaciones Adicionales"
                                    field="observaciones"
                                    placeholder="Información extra relevante..."
                                />

                                <TextField
                                    label="Recomendaciones de Mantenimiento"
                                    field="recomendaciones"
                                    placeholder="Acciones preventivas sugeridas..."
                                />

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Evidencia Fotográfica</label>
                                    <button
                                        onClick={handlePhotoCapture}
                                        className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-5 h-5" />
                                        <span>Tomar Foto ({formData.fotos.length} adjuntas)</span>
                                    </button>
                                </div>
                            </Section>

                            <button
                                onClick={generateReport}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition"
                            >
                                <FileText className="w-5 h-5" />
                                Generar Reporte
                            </button>
                        </div>
                    )}

                    {/* Tab: Vista Previa */}
                    {activeTab === 'preview' && (
                        <div className="space-y-4">
                            {generatedReport ? (
                                <>
                                    <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-blue-200">
                                            📋 Reporte generado exitosamente. Revisa la información y presiona "Finalizar" para enviar a C5 y Siemens.
                                        </p>
                                    </div>

                                    <pre className="bg-gray-800 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-auto max-h-96">
                                        {generatedReport}
                                    </pre>

                                    <button
                                        onClick={finalizarCaso}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Finalizar y Enviar Reporte
                                    </button>

                                    <p className="text-xs text-center text-gray-500">
                                        Al finalizar, el reporte se enviará automáticamente a C5 CDMX y Siemens Mobility
                                    </p>
                                </>
                            ) : (
                                <div className="bg-gray-800 rounded-xl p-8 text-center">
                                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400">Genera el reporte desde la pestaña "Reporte" para ver la vista previa</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Selección de Técnico */}
            {mostrarSeleccionTecnico && tecnicosCercanos.length > 0 && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            <User className="w-7 h-7 text-blue-400" />
                            Seleccionar Técnico
                        </h2>
                        <p className="text-gray-400 mb-6">
                            {tecnicosCercanos.length} técnicos disponibles • Ordenados por distancia
                        </p>

                        <div className="space-y-3">
                            {tecnicosCercanos.map((tecnico, index) => (
                                <button
                                    key={tecnico.id}
                                    onClick={() => asignarTecnico(tecnico)}
                                    className={`w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 text-left transition border-2 ${index === 0 ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-transparent hover:border-blue-500'
                                        }`}
                                >
                                    {index === 0 && (
                                        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold inline-block mb-2">
                                            ⭐ MÁS CERCANO - RECOMENDADO
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{tecnico.nombre}</h3>
                                            <p className="text-sm text-gray-400">{tecnico.id}</p>
                                            <p className="text-sm text-blue-400">{tecnico.especialidad}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400">Experiencia</div>
                                            <div className="text-lg font-bold text-yellow-400">{tecnico.experiencia} años</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-800 rounded-lg p-3">
                                            <p className="text-xs text-gray-400 mb-1">📍 Distancia</p>
                                            <p className="text-lg font-bold text-green-400">{tecnico.distancia}</p>
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-3">
                                            <p className="text-xs text-gray-400 mb-1">⏱️ Tiempo (con tráfico)</p>
                                            <p className="text-lg font-bold text-yellow-400">{tecnico.tiempoConTrafico}</p>
                                        </div>
                                    </div>

                                    {tecnico.telefono && (
                                        <div className="mt-2 text-xs text-gray-400">
                                            📞 {tecnico.telefono}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">¡Reporte Generado!</h2>
                        <p className="text-gray-300 mb-6">
                            El reporte ha sido enviado exitosamente a C5 y Siemens Mobility.
                            <br />
                            <span className="text-blue-400 font-semibold">📧 Correo enviado automáticamente.</span>
                            <br />
                            <span className="text-green-400 font-semibold">Caso marcado como resuelto.</span>
                        </p>
                        <div className="bg-gray-700 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-400 mb-1">Número de Reporte</p>
                            <p className="text-lg font-mono text-white">{autoData.reporte.numeroOT}</p>
                            <p className="text-sm text-gray-400 mt-3 mb-1">Tiempo Total de Atención</p>
                            <p className="text-lg font-mono text-green-400">{formatTime(timer)}</p>
                        </div>
                        <button
                            onClick={resetApp}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-4 rounded-xl font-semibold transition"
                        >
                            Continuar con Siguiente Falla
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
