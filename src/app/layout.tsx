import type { Metadata } from "next";
import AuthProvider from "../components/AuthProvider";
import 'leaflet/dist/leaflet.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Team Networks",
  description: "Nepali ko Sath Nepali kai Bikash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden bg-black text-white">
       <AuthProvider>
          <main className="w-full min-h-screen flex justify-center">
        <div className="w-full max-w-[480px]">
              {children}
          </div>
        </main>
        </AuthProvider>
      </body>

    </html>
  );
}