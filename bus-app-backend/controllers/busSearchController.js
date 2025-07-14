import { Bus } from '../models/Bus.js';
import { Route } from '../models/Route.js';
import { Schedule } from '../models/Schedule.js';
import { findConnectingRoutes } from '../utils/findConnectingRoutes.js';

export const busSearchController = {
  // Search available buses
  searchBuses: async (req, res) => {
    try {
      const { from, to, date } = req.query;

      if (!from || !to || !date) {
        return res.status(400).json({
          success: false,
          error: 'From, to and date are required'
        });
      }

      // Convert date string to Date object
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);

      // Find direct routes
      const directRoutes = await Route.find({
        'stops.location': { 
          $all: [from, to],
          $size: 2 
        },
        active: true
      }).populate('busId');

      // Get schedules for the routes
      const schedules = await Schedule.find({
        routeId: { $in: directRoutes.map(route => route._id) },
        date: {
          $gte: searchDate,
          $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 'scheduled'
      });

      // Calculate available seats and fares
      const availableBuses = schedules.map(schedule => {
        const route = directRoutes.find(r => 
          r._id.toString() === schedule.routeId.toString()
        );
        const bus = route.busId;

        const fromStop = route.stops.find(s => s.location === from);
        const toStop = route.stops.find(s => s.location === to);

        return {
          id: schedule._id,
          busName: bus.busNumber,
          busType: bus.type,
          departureTime: fromStop.departureTime,
          arrivalTime: toStop.arrivalTime,
          duration: (toStop.arrivalTime - fromStop.departureTime) / (1000 * 60), // in minutes
          availableSeats: schedule.availableSeats.filter(s => s.isAvailable).length,
          fare: route.baseFare,
          amenities: bus.amenities,
          companyName: bus.ownerId.companyName
        };
      });

      // If no direct routes, search for connecting routes
      let connectingBuses = [];
      if (availableBuses.length === 0) {
        connectingBuses = await findConnectingRoutes(from, to, searchDate);
      }

      res.json({
        success: true,
        data: {
          direct: availableBuses,
          connecting: connectingBuses
        }
      });
    } catch (error) {
      console.error('Bus search error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search buses'
      });
    }
  },

  // Get bus details with seat layout
  getBusDetails: async (req, res) => {
    try {
      const { scheduleId } = req.params;

      const schedule = await Schedule.findById(scheduleId)
        .populate({
          path: 'routeId',
          populate: {
            path: 'busId',
            select: 'busNumber type seatLayout amenities'
          }
        });

      if (!schedule) {
        return res.status(404).json({
          success: false,
          error: 'Schedule not found'
        });
      }

      const bus = schedule.routeId.busId;
      const seatLayout = bus.seatLayout;

      // Mark booked seats
      const availableSeats = schedule.availableSeats;
      const layout = seatLayout.layout.map(row =>
        row.map(seat => ({
          ...seat,
          isAvailable: availableSeats.find(
            s => s.seatNumber === seat.seatNumber
          )?.isAvailable ?? false
        }))
      );

      res.json({
        success: true,
        data: {
          busDetails: {
            busNumber: bus.busNumber,
            type: bus.type,
            amenities: bus.amenities
          },
          seatLayout: {
            ...seatLayout,
            layout
          },
          schedule: {
            id: schedule._id,
            date: schedule.date,
            status: schedule.status
          }
        }
      });
    } catch (error) {
      console.error('Get bus details error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get bus details'
      });
    }
  }
};