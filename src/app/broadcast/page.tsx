"use client";
import { useEffect, useRef } from "react";

export default function Broadcast() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Camera access denied.");
      }
    };
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-black mb-4">📹 Go Live from Mobile</h1>
      <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-white/10">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <button className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-full">Start Live</button>
          <span className="text-xs text-gray-400">Camera Active</span>
        </div>
      </div>
    </div>
  );
}