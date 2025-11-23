import React, { useState, useEffect } from 'react';
import { MapPin, Clock, AlertTriangle, CheckCircle, Navigation, User, Bell, X } from 'lucide-react';
import { TECHNICIANS } from './technicianData.js';

export default function TechnicianView({ tecnicoId, onAcceptFallo, onLogout }) {
    const [tecnico, setTecnico] = useState(null);
    const [fallosDisponibles, setFallosDisponibles] = useState([]);

    useEffect(() => {
        const tecnicoData = TECHNICIANS.find(t => t.id === tecnicoId);
        setTecnico(tecnicoData);

        // Cargar fallos disponibles desde localStorage
        cargarFallosDisponibles();

        // Actualizar cada 5 segundos
        const interval = setInterval(cargarFallosDisponibles, 5000);
        return () => clearInterval(interval);
    }, [tecnicoId]);

    const cargarFallosDisponibles = () => {
        const fallos = JSON.parse(localStorage.getItem('fallosActivos') || '[]');
        setFallosDisponibles(fallos.filter(f => !f.tecnicoAsignado));
    };

    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };

    const aceptarFallo = (fallo) => {
        // Marcar fallo como asignado
        const fallos = JSON.parse(localStorage.getItem('fallosActivos') || '[]');
        const falloIndex = fallos.findIndex(f => f.id === fallo.id);
        if (falloIndex !== -1) {
            fallos[falloIndex].tecnicoAsignado = tecnicoId;
            fallos[falloIndex].horaAceptacion = new Date().toISOString();
            localStorage.setItem('fallosActivos', JSON.stringify(fallos));
        }

        onAcceptFallo(fallo);
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'critico': 'bg-red-500',
            'alto': 'bg-orange-500',
            'medio': 'bg-yellow-500',
            'bajo': 'bg-green-500'
        };
        return colors[severity] || 'bg-gray-500';
    };

    if (!tecnico) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <User className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">{tecnico.nombre}</h1>
                            <p className="text-xs text-green-200">{tecnico.especialidad}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm transition"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Notificaciones de Fallos */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bell className="w-6 h-6 text-yellow-400" />
                        Fallos Disponibles
                    </h2>
                    <div className="bg-red-500 px-3 py-1 rounded-full text-sm font-bold">
                        {fallosDisponibles.length} Nuevos
                    </div>
                </div>

                {fallosDisponibles.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-400">No hay fallos disponibles en este momento</p>
                        <p className="text-sm text-gray-500 mt-2">Te notificaremos cuando haya nuevas incidencias</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {fallosDisponibles
                            .map(fallo => ({
                                ...fallo,
                                distancia: calcularDistancia(
                                    tecnico.ubicacion.lat,
                                    tecnico.ubicacion.lng,
                                    fallo.coordenadas.lat,
                                    fallo.coordenadas.lng
                                )
                            }))
                            .sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia))
                            .map((fallo, index) => (
                                <div
                                    key={fallo.id}
                                    className={`bg-gray-800 rounded-xl p-4 border-2 ${index === 0 ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-gray-700'
                                        }`}
                                >
                                    {index === 0 && (
                                        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold inline-block mb-2">
                                            ⭐ MÁS CERCANO
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{fallo.sensor}</h3>
                                            <p className="text-sm text-gray-400">{fallo.linea} - {fallo.lineaNombre}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(fallo.severidad)}`}>
                                            {fallo.severidad?.toUpperCase() || 'PENDIENTE'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div className="bg-gray-700/50 rounded-lg p-2">
                                            <p className="text-xs text-gray-400">Distancia</p>
                                            <p className="text-lg font-bold text-green-400">{fallo.distancia} km</p>
                                        </div>
                                        <div className="bg-gray-700/50 rounded-lg p-2">
                                            <p className="text-xs text-gray-400">Tiempo Est.</p>
                                            <p className="text-lg font-bold text-yellow-400">~{Math.ceil(parseFloat(fallo.distancia) * 3)} min</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <MapPin className="w-4 h-4" />
                                            <span>{fallo.ubicacion}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Clock className="w-4 h-4" />
                                            <span>Detectado: {new Date(fallo.fechaDeteccion).toLocaleString('es-MX')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>{fallo.tipoSensor}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => aceptarFallo(fallo)}
                                        className={`w-full p-3 rounded-lg font-semibold transition ${index === 0
                                                ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Navigation className="w-5 h-5" />
                                            Aceptar y Atender
                                        </div>
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
