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
      <body>
      <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
