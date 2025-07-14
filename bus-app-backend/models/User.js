import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'busowner', 'admin'],
    required: true
  },
  approved: {
    type: Boolean,
    default: function() {
      return this.role !== 'busowner'; // Only bus owners need approval
    }
  },
  
  // Bus owner specific fields
  companyName: String,
  licenseNumber: String,
  aadhaarImage: String,
  documents: [{
    type: String,
    url: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);

// const userSchema = {
//   id: 'string',
//   name: 'string',
//   email: 'string',
//   password: 'string (hashed)',
//   phone: 'string',
//   role: 'enum ["customer", "busowner", "admin"]',
//   approved: 'boolean',
//   createdAt: 'datetime',
//   // Bus owner specific fields
//   companyName: 'string?',
//   licenseNumber: 'string?',
//   aadhaarImage: 'string?' // URL to stored image
// };

// const busSchema = {
//   id: 'string',
//   ownerId: 'string',
//   busNumber: 'string',
//   capacity: 'number',
//   type: 'string',
//   amenities: 'string[]',
//   createdAt: 'datetime'
// };

// const scheduleSchema = {
//   id: 'string',
//   busId: 'string',
//   from: 'string',
//   to: 'string',
//   departureTime: 'datetime',
//   arrivalTime: 'datetime',
//   fare: 'number',
//   availableSeats: 'number',
//   status: 'enum ["active", "cancelled"]'
// };

// const bookingSchema = {
//   id: 'string',
//   userId: 'string',
//   scheduleId: 'string',
//   seatNumbers: 'number[]',
//   totalFare: 'number',
//   status: 'enum ["confirmed", "cancelled"]',
//   bookingTime: 'datetime',
//   qrCode: 'string'
// };    