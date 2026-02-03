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
      {/* overflow-x-hidden ले दायाँ बायाँ हल्लिन दिँदैन */}
      <body className="antialiased overflow-x-hidden bg-black text-white">
       <AuthProvider>
          <main className="w-full min-h-screen flex justify-center">
            {/* यहाँ ध्यान दिनुहोस्: 
               यदि STN Channel खुलेको छ भने 'max-w-none' हुनुपर्छ। 
               अहिलेका लागि यो डिभलाई हटाएर सिधै children राख्दा डेस्कटपमा टम्म भरिन्छ।
            */}
            <div className="w-full"> 
               {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}