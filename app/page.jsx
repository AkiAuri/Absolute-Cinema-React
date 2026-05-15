'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Router app to ensure BrowserRouter works on client side
const AppRouter = dynamic(() => import('./AppRouter'), { ssr: false });

function CinemaApp() {
  return <AppRouter />;
}

export default CinemaApp;
