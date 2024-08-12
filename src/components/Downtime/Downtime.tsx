"use client";

import { useEffect } from 'react';
import { signOut } from "next-auth/react";

const Downtime = () => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(signOut, 7200000); // 2 horas en milisegundos
    };

    useEffect(() => {
        // Escuchas los eventos que indican actividad del usuario
        window.addEventListener('click', resetTimer, false);
        window.addEventListener('mousemove', resetTimer, false);

        // Inicias el temporizador
        resetTimer();

        return () => {
            // Limpias el temporizador y los listeners cuando el componente se desmonte
            clearTimeout(inactivityTimer);
            window.removeEventListener('click', resetTimer, false);
            window.removeEventListener('mousemove', resetTimer, false);
        };
    }, []);

    return null; // Devuelve null porque no necesita renderizar nada
};

export default Downtime;
