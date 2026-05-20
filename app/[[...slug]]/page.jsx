"use client";

import React, { useEffect, useState } from 'react';
import AppRouter from '../../AppRouter'; // Ensure this import path is correct for your setup

export default function CatchAllPage() {
    const [isMounted, setIsMounted] = useState(false);

    // This ensures react-router-dom only runs in the browser, preventing server crashes
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-amber-500 font-bold">Loading...</p>
            </div>
        );
    }

    return <AppRouter />;
}