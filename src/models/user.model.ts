import mongoose, { Schema, Document } from 'mongoose';

// User role haru: Normal User wa Service Provider (Vendor)
export enum UserRole {
  USER = 'user',
  VENDOR = 'vendor',
  ADMIN = 'admin'
}

// Tapāīnkō specific categories
export type ServiceCategory = 
  | "Restaurant" | "Hotel & Lodge" | "Rider & Parcel" 
  | "Doctor's & Hospital" | "Tour & Travel" | "Fashion & Boutique" 
  | "Men's Wear & Apparel" | "Party Place & Banquet Hall" 
  | "Jobs & Employment" | "Auto Sell & Purchase" 
  | "Women Beauty & Fitness" | "Sweets & Bakery" | "Farmer & Farming";

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  profilePicture?: string;
  
  // Service Provider ko lagi matra (Conditional Fields)
  isVerifiedVendor: boolean;
  category?: ServiceCategory; // Mathiko list bata kunai ek
  businessName?: string;
  location: {
    address: string;
    coordinates: [number, number]; // [Longitude, Latitude] for Map
  };
  
  // User le kun kun sēwā dherai herchha (Personalization)
  interests: ServiceCategory[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  profilePicture: { type: String, default: "" },
  
  isVerifiedVendor: { type: Boolean, default: false },
  category: { 
    type: String, 
    enum: [
      "Restaurant", "Hotel & Lodge", "Rider & Parcel", "Doctor's & Hospital",
      "Tour & Travel", "Fashion & Boutique", "Men's Wear & Apparel",
      "Party Place & Banquet Hall", "Jobs & Employment", "Auto Sell & Purchase",
      "Women Beauty & Fitness", "Sweets & Bakery", "Farmer & Farming"
    ]
  },
  businessName: { type: String },
  location: {
    address: { type: String },
    coordinates: { type: [Number], index: '2dsphere' } // Map ma distance calculate garna
  },
  
  interests: [{ type: String }],
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);