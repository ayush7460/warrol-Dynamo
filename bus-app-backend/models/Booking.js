import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  seats: [{
    seatNumber: String,
    passengerName: String,
    age: Number,
    gender: String
  }],
  totalFare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  bookingCode: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate unique booking code before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingCode) {
    this.bookingCode = 'BK' + Date.now() + Math.random().toString(36).substring(7).toUpperCase();
  }
  next();
});

export const Booking = mongoose.model('Booking', bookingSchema);