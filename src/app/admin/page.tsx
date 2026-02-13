"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  
  // States
  const [bookings, setBookings] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<string[]>([]);
  const [script, setScript] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const ADMIN_EMAIL = "durga98578giri22921@gmail.com"; 

  // 1. Socket Connection & Data Fetching
  useEffect(() => {
    // सोकेट कनेक्सन सेट गर्ने (Cleanup सहित)
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001");
    }

    if (status === "unauthenticated" || (session && session.user?.email !== ADMIN_EMAIL)) {
      router.push("/");
    }

    if (session?.user?.email === ADMIN_EMAIL) {
      // १. बुकिङहरू तान्ने
      fetch('/api/admin/bookings')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setBookings(data.data);
        });

      // २. रेकर्डिङहरू तान्ने (Port 3001 बाट)
      const fetchRecordings = () => {
        fetch('http://localhost:3001/api/recordings')
          .then((res) => res.json())
          .then((data) => setRecordings(data))
          .catch(() => console.log("Waiting for Server 3001..."));
      };
      
      fetchRecordings();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session, status, router]);

  // 🎙️ AI News Function
  const generateAINews = async () => {
    setLoadingAI(true);
    setAudioUrl("");
    try {
      // १. ३००१ पोर्टबाट एआई न्यूज स्क्रिप्ट लिने
      const scriptRes = await fetch('http://localhost:3001/api/ai/news-script');
      const scriptData = await scriptRes.json();
      setScript(scriptData.script);

      // २. सोकेट मार्फत च्यानलमा पठाउने
      if (socketRef.current) {
        socketRef.current.emit('update-news', scriptData.script);
      }

      // ३. एआई आवाज जेनेरेट गर्ने
      const voiceRes = await fetch('http://localhost:3001/api/ai/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scriptData.script })
      });
      const voiceData = await voiceRes.json();
      
      if (voiceData.success) {
        setAudioUrl(`http://localhost:3001${voiceData.audioUrl}`);
        alert("✅ AI News Broadcasted Successfully!");
      }
    } catch (e) {
      alert("❌ Error: Port 3001 Server Offline. Run 'node server.js' first.");
    }
    setLoadingAI(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
    }
  };

  if (status === "loading") return <div className="p-10 text-white bg-black min-h-screen font-mono italic text-center animate-pulse">STN_SECURE_ACCESS_VERIFYING...</div>;
  if (!session || session.user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-4xl font-black text-cyan-400 tracking-tighter uppercase italic">STN Unified Admin</h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">System Status: <span className="text-green-500 animate-pulse">Operational</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold italic tracking-widest">Root Access</p>
          <p className="text-sm text-cyan-500 font-mono">{session.user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: AI News Control */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900/50 border border-cyan-900/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
              AI News Engine
            </h2>
            
            <button 
              onClick={generateAINews}
              disabled={loadingAI}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 ${
                loadingAI ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              }`}
            >
              {loadingAI ? "CONNECTING TO GEMINI..." : "GENERATE & BROADCAST"}
            </button>

            {script && (
              <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
                <p className="text-[10px] text-cyan-500 font-bold uppercase mb-1 tracking-widest">Broadcast Script</p>
                <p className="text-xs text-gray-300 italic leading-relaxed">"{script}"</p>
              </div>
            )}

            {audioUrl && (
              <div className="mt-6 p-4 bg-black/40 rounded-xl border border-gray-800">
                <p className="text-[10px] text-gray-500 uppercase mb-3 font-bold">Voice Monitor</p>
                <audio src={audioUrl} controls className="w-full h-8 accent-cyan-500" />
              </div>
            )}
          </div>

          {/* Media Logs */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 italic">Storage: Media Recaps</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {recordings.length > 0 ? recordings.map((file, i) => (
                <div key={i} className="text-[11px] p-2 bg-white/5 rounded border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                  <span className="truncate w-32 text-gray-400 group-hover:text-white font-mono">{file}</span>
                  <a href={`http://localhost:3001/live/record/${file}`} target="_blank" className="text-cyan-500 font-bold hover:text-cyan-400 uppercase text-[9px]">View</a>
                </div>
              )) : <p className="text-gray-700 text-xs italic text-center py-4 uppercase">No Media Found</p>}
            </div>
          </div>
        </div>

        {/* RIGHT: Booking Management */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 shadow-2xl backdrop-blur-sm">
            <div className="p-4 border-b border-gray-800 bg-gray-800/20 flex justify-between items-center">
              <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 italic">Live Order Queue</h2>
              <span className="text-[10px] bg-cyan-900/40 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full uppercase font-black">{bookings.length} Orders</span>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800/40 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-800">
                  <th className="p-4 text-left">Identity</th>
                  <th className="p-4 text-left">Target</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-gray-200 group-hover:text-white">{b.userName}</p>
                      <p className="text-[10px] text-gray-500 font-mono italic lowercase">{b.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-cyan-400 font-black tracking-widest font-mono">T-{b.tableNo}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                        b.status === 'Pending' ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20' : 'text-green-500 bg-green-500/10 border border-green-500/20'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {b.status === 'Pending' ? (
                        <button onClick={() => updateStatus(b._id, 'Confirmed')} className="bg-white text-black px-4 py-1.5 rounded text-[10px] font-black hover:bg-cyan-400 hover:text-black transition-all shadow-lg active:scale-90 uppercase tracking-widest">
                          Authorize
                        </button>
                      ) : <span className="text-gray-600 text-[10px] uppercase font-bold font-mono italic">Verified ✅</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-gray-700 text-sm font-mono tracking-tighter italic uppercase">Memory Queue Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}