import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  availableSeats: [{
    seatNumber: String,
    isAvailable: Boolean,
    price: Number
  }],
  status: {
    type: String,
    enum: ['scheduled', 'started', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

// Compound index for quick searches
scheduleSchema.index({ routeId: 1, date: 1 });

export const Schedule = mongoose.model('Schedule', scheduleSchema);