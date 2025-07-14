import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  arrivalTime: Date,
  departureTime: Date,
  distance: Number // distance from start in km
});

const routeSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  routeNumber: {
    type: String,
    required: true
  },
  stops: [stopSchema],
  baseFare: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Route = mongoose.model('Route', routeSchema);