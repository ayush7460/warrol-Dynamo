export const adminController = {
  listPendingOwners: async (req, res) => {
    // TODO: Query and list bus owners with approved: false
    res.json({ success: true, owners: [] });
  },
  approveOwner: async (req, res) => {
    // TODO: Approve bus owner by ID
    res.json({ success: true, message: 'Owner approved (stub)' });
  }
};