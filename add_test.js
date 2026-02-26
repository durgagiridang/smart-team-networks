const mongoose = require('mongoose');

// MongoDB URI
const MONGODB_URI = "mongodb+srv://channelstn97_db_user:durgaprasadgiri@cluster0.vot2ymv.mongodb.net/SmartTeamNetworks";

const MerchantSchema = new mongoose.Schema({
  business_name: String,
  category: String,
  city: String,
  cctv_url: String,
  created_at: { type: Date, default: Date.now }
});

const Merchant = mongoose.model('Merchant', MerchantSchema);

async function addData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ मङ्गोडिबीसँग जोडियो...");

    const testShop = new Merchant({
      business_name: "Smart Team Fashion",
      category: "Fashion & Boutique",
      city: "Dang",
      cctv_url: "http://test-stream-url.com/live"
    });

    await testShop.save();
    console.log("🚀 नमुना पसल सफलतापूर्वक थपियो! अब होमपेज रिफ्रेस गर्नुहोस्।");
    process.exit();
  } catch (err) {
    console.error("❌ त्रुटि:", err);
  }
}

addData();