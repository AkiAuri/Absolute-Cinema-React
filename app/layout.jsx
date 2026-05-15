import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata = {
  title: 'AbsoluteCinema! - Ticket Sales System',
  description: 'Your premier cinema ticket sales platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} dark bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
