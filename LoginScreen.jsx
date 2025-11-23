import React, { useState } from 'react';
import { User, Shield, Users } from 'lucide-react';
import { TECHNICIANS } from './technicianData.js';

export default function LoginScreen({ onLogin }) {
    const [selectedRole, setSelectedRole] = useState(null);

    const roles = [
        {
            id: 'admin',
            nombre: 'Centro de Control',
            descripcion: 'Monitoreo y gestión de incidencias',
            icon: Shield,
            color: 'from-purple-600 to-blue-600'
        },
        {
            id: 'tecnico',
            nombre: 'Técnico de Campo',
            descripcion: 'Atención de fallos en sitio',
            icon: User,
            color: 'from-green-600 to-teal-600'
        }
    ];

    const handleRoleSelect = (role) => {
        if (role === 'admin') {
            onLogin('admin', null);
        } else {
            setSelectedRole('tecnico');
        }
    };

    const handleTechnicianSelect = (tecnico) => {
        onLogin('tecnico', tecnico.id);
    };

    if (selectedRole === 'tecnico') {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <button
                        onClick={() => setSelectedRole(null)}
                        className="mb-4 text-gray-400 hover:text-white transition"
                    >
                        ← Volver
                    </button>

                    <div className="bg-gray-800 rounded-2xl p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <Users className="w-7 h-7 text-green-400" />
                            Selecciona tu Perfil
                        </h2>
                        <p className="text-gray-400">Elige tu cuenta de técnico para continuar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {TECHNICIANS.map((tecnico) => (
                            <button
                                key={tecnico.id}
                                onClick={() => handleTechnicianSelect(tecnico)}
                                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-left transition border-2 border-transparent hover:border-green-500"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{tecnico.nombre}</h3>
                                        <p className="text-xs text-gray-400">{tecnico.id}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-300">{tecnico.especialidad}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{tecnico.experiencia} años exp.</span>
                                    <span className={`text-xs px-2 py-1 rounded ${tecnico.disponible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {tecnico.disponible ? 'Disponible' : 'Ocupado'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Sistema ARIA
                    </h1>
                    <p className="text-gray-400">Agente de Respuesta Inteligente - Siemens Mobility</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            className="group relative overflow-hidden bg-gray-800 hover:bg-gray-700 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-white/20"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                            <div className="relative">
                                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <role.icon className="w-8 h-8" />
                                </div>

                                <h2 className="text-2xl font-bold mb-2">{role.nombre}</h2>
                                <p className="text-gray-400">{role.descripcion}</p>

                                <div className="mt-4 text-sm text-gray-500 group-hover:text-gray-400 transition">
                                    Click para continuar →
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Sistema de Gestión de Incidencias - Metro CDMX</p>
                </div>
            </div>
        </div>
    );
}
