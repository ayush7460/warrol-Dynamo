import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const BusOwnerDashboard = () => {
  const [buses, setBuses] = useState([]);
  useEffect(() => {
    api.get('/buses/my').then(res => setBuses(res.data.buses));
  }, []);
  // Add/manage buses UI here
  return <div>My Buses: {buses.length}</div>
};
export default BusOwnerDashboard;