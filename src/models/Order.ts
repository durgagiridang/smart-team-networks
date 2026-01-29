import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  // required: true लाई हटाएर default राख्दा अर्डर अड्किँदैन
  userEmail: { 
    type: String, 
    default: "walk-in@customer.com" 
  },
  items: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Cooking', 'Ready', 'Out for Delivery', 'Delivered'], 
    default: 'Pending' 
  },
  orderType: { 
    type: String, 
    enum: ['Delivery', 'Dine-In'], 
    default: 'Dine-In' // रेस्टुरेन्टको लागि Dine-In सजिलो हुन्छ
  }
}, { timestamps: true });

export default models.Order || model("Order", OrderSchema);