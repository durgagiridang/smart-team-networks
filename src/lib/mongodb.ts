import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000, // 5 seconds ma fail hune
      bufferCommands: false, // Error buffering banda garne
    });
    console.log("✅ MongoDB Connected: SmartTeamNetworks");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    throw error;
  }
}