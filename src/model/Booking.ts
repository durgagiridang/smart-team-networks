import { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  service: { type: String, required: true },
  pickupAddress: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  coords: {
    lat: Number,
    lng: Number
  },
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
});

// models.Booking le paila banisakeko model check garchha, natra naya banauchha
const Booking = models.Booking || model('Booking', BookingSchema);
export default Booking;