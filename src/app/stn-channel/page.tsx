"use client";
import STNChannel from "@/components/STNChannel";

export default function STNChannelPage() {
  return (
    <STNChannel 
      videoUrl="https://your-project.vercel.app/live.m3u8"  // ← Cloud HLS
    />
  );
}