import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// १. सिधै लिङ्क राख्ने (यसले "undefined" हुने समस्या हटाउँछ)
const MONGODB_URI = "mongodb+srv://channelstn97_db_user:StnStore2026@cluster0.vot2ymv.mongodb.net/SmartTeamNetworks";

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected for Chat");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

// २. म्यासेजको ढाँचा (Schema)
const ChatSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

// ३. म्यासेजहरू ल्याउने (GET)
export async function GET() {
  try {
    await connectToDatabase();
    const messages = await Chat.find({}).sort({ timestamp: 1 }).limit(50);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ४. नयाँ म्यासेज पठाउने (POST)
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, text } = await req.json();
    const newMessage = await Chat.create({ username, text });
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}