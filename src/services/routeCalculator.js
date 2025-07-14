export const calculateMultiLegJourney = async (from, to, date) => {
  try {
    const directRoutes = await busApi.searchBuses(from, to, date);
    
    if (directRoutes.length > 0) {
      return {
        type: 'direct',
        routes: directRoutes
      };
    }
    
    // Search for connecting routes
    const connecting = await busApi.searchConnectingRoutes(from, to, date);
    
    if (connecting.length > 0) {
      return {
        type: 'connecting',
        routes: connecting.map(route => ({
          legs: route.legs,
          totalFare: route.legs.reduce((sum, leg) => sum + leg.fare, 0),
          totalDuration: calculateTotalDuration(route.legs)
        }))
      };
    }
    
    return { type: 'none', routes: [] };
  } catch (error) {
    console.error('Error calculating routes:', error);
    throw error;
  }
};