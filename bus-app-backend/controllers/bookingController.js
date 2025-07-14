import { Booking } from '../models/Booking.js';
import { Schedule } from '../models/Schedule.js';
import { generateTicket } from '../utils/ticketGenerator.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

export const bookingController = {
  // Create new booking
  createBooking: async (req, res) => {
    try {
      const { scheduleId, seats, passengers } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!scheduleId || !seats || !passengers) {
        return res.status(400).json({
          success: false,
          error: 'All booking details are required'
        });
      }

      // Check schedule exists and seats are available
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          error: 'Schedule not found'
        });
      }

      // Verify seat availability
      const unavailableSeats = seats.filter(seatNumber => {
        const seat = schedule.availableSeats.find(
          s => s.seatNumber === seatNumber
        );
        return !seat || !seat.isAvailable;
      });

      if (unavailableSeats.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Seats ${unavailableSeats.join(', ')} are not available`
        });
      }

      // Calculate total fare
      const totalFare = seats.reduce((sum, seatNumber) => {
        const seat = schedule.availableSeats.find(
          s => s.seatNumber === seatNumber
        );
        return sum + seat.price;
      }, 0);

      // Create booking
      const booking = new Booking({
        userId,
        scheduleId,
        seats: seats.map((seatNumber, index) => ({
          seatNumber,
          passengerName: passengers[index].name,
          age: passengers[index].age,
          gender: passengers[index].gender
        })),
        totalFare,
        status: 'pending'
      });

      await booking.save();

      // Update seat availability
      await Schedule.updateMany(
        { _id: scheduleId },
        {
          $set: {
            'availableSeats.$[seat].isAvailable': false
          }
        },
        {
          arrayFilters: [{ 'seat.seatNumber': { $in: seats } }]
        }
      );

      res.status(201).json({
        success: true,
        data: {
          bookingId: booking._id,
          bookingCode: booking.bookingCode,
          totalFare
        }
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create booking'
      });
    }
  },

  // Confirm booking after payment
  confirmBooking: async (req, res) => {
    try {
      const { bookingId, paymentId } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Update booking status
      booking.status = 'confirmed';
      booking.paymentId = paymentId;
      booking.paymentStatus = 'completed';
      await booking.save();

      // Generate ticket
      const ticket = await generateTicket(booking);

      // Send confirmation email
      await sendBookingConfirmation(booking, ticket);

      res.json({
        success: true,
        data: {
          booking: {
            id: booking._id,
            code: booking.bookingCode,
            status: booking.status
          },
          ticket
        }
      });
    } catch (error) {
      console.error('Confirm booking error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to confirm booking'
      });
    }
  },
    // List bookings for logged-in user
  listMyBookings: async (req, res) => {
    try {
      const userId = req.user.id;
      const bookings = await Booking.find({ userId });
      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('List bookings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve bookings'
      });
    }
  },

  // Get details for a specific booking
  getBookingDetails: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }
      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Get booking details error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get booking details'
      });
    }
  }

};

