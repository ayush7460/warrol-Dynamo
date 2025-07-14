import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper']
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String
  }],
  seatLayout: {
    totalRows: Number,
    seatsPerRow: Number,
    layout: [[{
      seatNumber: String,
      type: String,
      price: Number
    }]]
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Bus = mongoose.model('Bus', busSchema);