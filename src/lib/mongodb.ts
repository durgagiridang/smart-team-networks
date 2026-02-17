import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;

  // URI छैन भने रोक्ने र म्यासेज दिने
  if (!MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI is missing in .env file");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    console.log("✅ MongoDB Connected: SmartTeamNetworks");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    // यहाँ throw नगर्नुहोस् ताकि मोबाइल एप क्र्यास नहोस्
  }
}