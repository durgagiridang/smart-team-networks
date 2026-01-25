// app/api/bookings/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const dummyBookings = [
    {
      _id: "66f1a2b3c4d5e6f7g8h9i0j1",
      service: "Rider & Parcel",
      date: "2025-01-20T10:30:00Z",
      status: "Completed",
    },
    {
      _id: "77g2b3c4d5e6f7g8h9i0j1k2",
      service: "Document Pickup",
      date: "2025-01-21T14:45:00Z",
      status: "Pending",
    },
  ];

  return NextResponse.json(dummyBookings);
}