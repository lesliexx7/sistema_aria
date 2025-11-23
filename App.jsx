import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen.jsx';
import ARIAApp from './ARIAApp.jsx';
import TechnicianView from './TechnicianView.jsx';

export default function App() {
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [falloAceptado, setFalloAceptado] = useState(null);

    const handleLogin = (role, id) => {
        setUserRole(role);
        setUserId(id);
    };

    const handleLogout = () => {
        setUserRole(null);
        setUserId(null);
        setFalloAceptado(null);
    };

    const handleAcceptFallo = (fallo) => {
        setFalloAceptado(fallo);
    };

    // Si no hay usuario logueado, mostrar pantalla de login
    if (!userRole) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    // Si es técnico y aceptó un fallo, mostrar la app de trabajo
    if (userRole === 'tecnico' && falloAceptado) {
        return <ARIAApp
            mode="tecnico"
            tecnicoId={userId}
            falloInicial={falloAceptado}
            onLogout={handleLogout}
        />;
    }

    // Si es técnico sin fallo aceptado, mostrar lista de fallos
    if (userRole === 'tecnico') {
        return <TechnicianView
            tecnicoId={userId}
            onAcceptFallo={handleAcceptFallo}
            onLogout={handleLogout}
        />;
    }

    // Si es admin, mostrar la app completa
    return <ARIAApp mode="admin" onLogout={handleLogout} />;
}
