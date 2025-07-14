export const routeController = {
  addRoute: async (req, res) => {
    // TODO: Add route logic
    res.json({ success: true, message: 'Route added (stub)' });
  },
  listMyRoutes: async (req, res) => {
    // TODO: List bus owner's routes
    res.json({ success: true, routes: [] });
  },
  getRouteDetails: async (req, res) => {
    // TODO: Get route details
    res.json({ success: true, route: {} });
  },
  listAllRoutes: async (req, res) => {
    // TODO: List all routes
    res.json({ success: true, routes: [] });
  }
};