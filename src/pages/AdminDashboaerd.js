import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  useEffect(() => {
    api.get('/admin/pending-owners').then(res => {
      setPendingOwners(res.data.owners);
    });
  }, []);
  // Approval logic here
  return <div>Pending Owners: {pendingOwners.length}</div>
};
export default AdminDashboard;