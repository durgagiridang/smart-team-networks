"use client";
import STNChannel from "@/components/STNChannel";

export default function STNChannelPage() {
  return (
    <STNChannel 
      videoUrl="http://localhost:8000/live/kitchen.flv" 
    />
  );
}