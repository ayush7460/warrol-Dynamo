import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    api.get('/bookings/my').then(res => setBookings(res.data.bookings));
  }, []);
  // Booking list UI here
  return <div>My Bookings: {bookings.length}</div>
};
export default CustomerDashboard;