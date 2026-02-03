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
          {/* यहाँ max-w हटाइएको छ ताकि च्यानल फुल स्क्रिन हुन सकोस् */}
          <main className="w-full min-h-screen flex justify-center">
             <div className="w-full">
                {children}
             </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}