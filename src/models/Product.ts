import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true }, // यहाँ Cloudinary को लिङ्क बस्छ
  size: { type: String },
}, { timestamps: true });

// यदि पहिले नै बनेको छ भने त्यसैलाई चलाउने
const Product = models.Product || model("Product", ProductSchema);
export default Product;