import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Clock, Train, Activity, ArrowLeft } from 'lucide-react';

export default function Dashboard({ onBack }) {
    const [fallos, setFallos] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        porLinea: {},
        porSeveridad: {},
        porSensor: {},
        tiempoPromedio: 0,
        impactoTotal: { minutos: 0, trenes: 0 }
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        const fallosGuardados = JSON.parse(localStorage.getItem('fallosCompletados') || '[]');
        setFallos(fallosGuardados);
        calcularEstadisticas(fallosGuardados);
    };

    const calcularEstadisticas = (fallosData) => {
        if (fallosData.length === 0) {
            setStats({
                total: 0,
                porLinea: {},
                porSeveridad: {},
                porSensor: {},
                tiempoPromedio: 0,
                impactoTotal: { minutos: 0, trenes: 0 }
            });
            return;
        }

        const porLinea = {};
        const porSeveridad = {};
        const porSensor = {};
        let tiempoTotal = 0;
        let minutosTotal = 0;
        let trenesTotal = 0;

        fallosData.forEach(fallo => {
            // Por línea
            porLinea[fallo.linea] = (porLinea[fallo.linea] || 0) + 1;

            // Por severidad
            porSeveridad[fallo.severidad || 'sin clasificar'] = (porSeveridad[fallo.severidad || 'sin clasificar'] || 0) + 1;

            // Por sensor
            porSensor[fallo.sensor] = (porSensor[fallo.sensor] || 0) + 1;

            // Tiempos e impactos
            tiempoTotal += fallo.tiempoAtencion || 0;
            minutosTotal += fallo.impactoMinutos || 0;
            trenesTotal += fallo.trenesAfectados || 0;
        });

        setStats({
            total: fallosData.length,
            porLinea,
            porSeveridad,
            porSensor,
            tiempoPromedio: Math.round(tiempoTotal / fallosData.length),
            impactoTotal: { minutos: minutosTotal, trenes: trenesTotal }
        });
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'critico': 'bg-red-500',
            'alto': 'bg-orange-500',
            'medio': 'bg-yellow-500',
            'bajo': 'bg-green-500',
            'sin clasificar': 'bg-gray-500'
        };
        return colors[severity] || 'bg-gray-500';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="font-bold text-lg">Dashboard de Fallos</h1>
                            <p className="text-xs text-purple-200">Sistema ARIA - Análisis de Incidencias</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">{stats.total} Fallos</span>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Estadísticas Generales */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-5 h-5" />
                            <span className="text-xs opacity-80">Total Fallos</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-xs opacity-80">Tiempo Promedio</span>
                        </div>
                        <p className="text-3xl font-bold">{formatTime(stats.tiempoPromedio)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-xs opacity-80">Minutos Retraso</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.impactoTotal.minutos}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Train className="w-5 h-5" />
                            <span className="text-xs opacity-80">Trenes Afectados</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.impactoTotal.trenes}</p>
                    </div>
                </div>

                {/* Fallos por Línea */}
                <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Train className="w-5 h-5 text-blue-400" />
                        Fallos por Línea
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(stats.porLinea).map(([linea, cantidad]) => (
                            <div key={linea} className="flex items-center justify-between">
                                <span className="text-sm">{linea}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${(cantidad / stats.total) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold w-8 text-right">{cantidad}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fallos por Severidad */}
                <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        Fallos por Severidad
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(stats.porSeveridad).map(([severidad, cantidad]) => (
                            <div key={severidad} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(severidad)}`} />
                                    <span className="text-sm capitalize">{severidad}</span>
                                </div>
                                <span className="text-sm font-bold">{cantidad}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Sensores con Fallos */}
                <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                        Top Sensores con Fallos
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(stats.porSensor)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 10)
                            .map(([sensor, cantidad]) => (
                                <div key={sensor} className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
                                    <span className="text-sm font-mono">{sensor}</span>
                                    <span className="text-sm font-bold text-yellow-400">{cantidad}</span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Historial Reciente */}
                <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-3">Historial Reciente</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {fallos.slice().reverse().slice(0, 20).map((fallo, index) => (
                            <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-mono text-blue-400">{fallo.id}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(fallo.fecha).toLocaleString('es-MX')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold">{fallo.sensor}</p>
                                        <p className="text-xs text-gray-400">{fallo.linea}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-block px-2 py-1 rounded text-xs ${getSeverityColor(fallo.severidad)}`}>
                                            {fallo.severidad || 'N/A'}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{formatTime(fallo.tiempoAtencion)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {stats.total === 0 && (
                    <div className="bg-gray-800 rounded-xl p-8 text-center">
                        <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No hay fallos registrados aún</p>
                        <p className="text-sm text-gray-500 mt-2">Completa algunos reportes para ver las estadísticas</p>
                    </div>
                )}
            </div>
        </div>
    );
}

