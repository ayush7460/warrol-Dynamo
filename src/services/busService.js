import { api } from './api';

export const busApi = {
  // Bus Owner APIs
  addBus: async (busData) => {
    const response = await api.post('/buses', busData);
    return response.data;
  },
  
  updateBus: async (busId, updates) => {
    const response = await api.put(`/buses/${busId}`, updates);
    return response.data;
  },
  
  getBusSchedules: async (busId) => {
    const response = await api.get(`/buses/${busId}/schedules`);
    return response.data;
  },
  
  // Customer APIs
  searchBuses: async (from, to, date) => {
    const response = await api.get('/buses/search', { 
      params: { from, to, date } 
    });
    return response.data;
  },
  
  bookTicket: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  getBookingHistory: async () => {
    const response = await api.get('/bookings/history');
    return response.data;
  },
  
  // Admin APIs
  approveOwner: async (ownerId) => {
    const response = await api.post(`/admin/approve-owner/${ownerId}`);
    return response.data;
  },
  
  getPendingApprovals: async () => {
    const response = await api.get('/admin/pending-approvals');
    return response.data;
  }
};