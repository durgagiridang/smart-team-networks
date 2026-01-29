import { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  // डेटाबेसमा भएको डेटासँग मेल खाने फिल्डहरू
  userEmail: { type: String, required: true }, // 'email' को सट्टा 'userEmail'
  userName: { type: String },
  restaurantName: { type: String, default: "Smart Nepali Khaja" },
  service: { type: String, required: true },
  tableNo: { type: String }, // रेस्टुरेन्टको लागि यो महत्त्वपूर्ण छ
  guestCount: { type: Number },
  
  // अरु सेवाहरूको लागि (Rider/Parcel)
  pickupAddress: { type: String },
  dropoffLocation: { type: String },
  coords: {
    lat: Number,
    lng: Number
  },
  
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Booking = models.Booking || model('Booking', BookingSchema);
export default Booking;