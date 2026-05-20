// app/layout.jsx
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import './globals.css'; // Make sure your CSS is imported here!

export const metadata = {
    title: 'CineBook - Cinema Ticketing System',
    description: 'Book your cinema tickets easily',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-gray-900 text-white min-h-screen">
        <AuthProvider>
            <MovieProvider>
                {children}
            </MovieProvider>
        </AuthProvider>
        </body>
        </html>
    );
}