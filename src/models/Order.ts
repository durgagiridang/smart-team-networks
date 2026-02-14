import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  userEmail: { 
    type: String, 
    default: "walk-in@customer.com" 
  },
  // --- STN Channel को लागि नयाँ Fields ---
  customerName: { type: String }, 
  phone: { type: String },
  productName: { type: String },
  
  // --- Restaurant को लागि पुराना Fields ---
  items: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, default: 0 }, // required हटाएर default राखियो ताकि च्यानल अर्डर नअड्कियोस्

  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Cooking', 'Ready', 'Out for Delivery', 'Delivered', 'Completed'], 
    default: 'Pending' 
  },
  orderType: { 
    type: String, 
    enum: ['Delivery', 'Dine-In', 'Live-Order'], // 'Live-Order' थपियो
    default: 'Dine-In'
  }
}, { timestamps: true });

export default models.Order || model("Order", OrderSchema);