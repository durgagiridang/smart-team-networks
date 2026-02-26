import type { Metadata, Viewport } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext'; // ✅ Change from @/hooks/useAuth
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'STN - Smart Team Networks',
  description: 'Nepali ko Sath Nepali ko Bikash',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ne' suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black' />
        <link rel='apple-touch-icon' href='/icon-192x192.png' />
      </head>
      <body className='antialiased overflow-x-hidden bg-[#0F0F0F] text-white'>
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" />
            <main className='w-full min-h-screen flex justify-center'>
              <div className='w-full'>{children}</div>
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}