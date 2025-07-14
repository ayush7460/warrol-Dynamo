import express from 'express';
import { bookingController } from '../controllers/bookingController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, bookingController.createBooking);
router.post('/confirm', auth, bookingController.confirmBooking);
router.get('/my', auth, bookingController.listMyBookings);
router.get('/:id', auth, bookingController.getBookingDetails);

export default router;