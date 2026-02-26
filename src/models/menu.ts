import mongoose, { Schema, model, models } from "mongoose";

const MenuSchema = new Schema({
  // कुन रेस्टुरेन्टको खाना हो?
  restaurantName: { 
    type: String, 
    default: "Smart Nepali Khaja" 
  },
  name: { 
    type: String, 
    required: [true, "खानाको नाम अनिवार्य छ"],
    trim: true 
  },
  price: { 
    type: Number, 
    required: [true, "मूल्य अनिवार्य छ"] 
  },
  category: { 
    type: String, 
    enum: ['Food', 'Beverage', 'Dessert', 'Snacks'],
    default: 'Food'
  },
  image: { 
    type: String, 
    default: "" // खानाको फोटोको लिङ्क
  },
  description: {
    type: String,
    default: ""
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true }); // यसले कहिले थपिएको हो (CreatedAt) आफै राख्छ

export default models.Menu || model("Menu", MenuSchema);