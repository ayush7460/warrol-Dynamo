export const busController = {
  addBus: async (req, res) => {
    // TODO: Add bus logic
    res.json({ success: true, message: 'Bus added (stub)' });
  },
  listMyBuses: async (req, res) => {
    // TODO: List bus owner's buses
    res.json({ success: true, buses: [] });
  },
  updateBus: async (req, res) => {
    // TODO: Update bus info
    res.json({ success: true, message: 'Bus updated (stub)' });
  },
  getBusDetails: async (req, res) => {
    // TODO: Get bus details
    res.json({ success: true, bus: {} });
  },
  listAllBuses: async (req, res) => {
    // TODO: List all buses (admin)
    res.json({ success: true, buses: [] });
  }
};