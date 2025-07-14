import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthProvider, { useAuth } from './src/context/AuthContext'; // Fixed import

// Auth screens
import RoleSelector from './src/pages/auth/RoleSelector';
import LoginScreen from './src/pages/auth/LoginScreen';
import SignupScreen from './src/pages/auth/SignupScreen';

// Role-based home screens
import CustomerHome from './src/pages/HomeScreen'; // Changed to HomeScreen for consistency
import OwnerDashboard from './src/pages/OwnerDashboard';
import AdminDashboard from './src/pages/AdminDashboard';

import SearchBusesScreen from './src/pages/SearchBusesScreen'; // Import SearchBusesScreen
import BusListScreen from './src/pages/BusListScreen';
import BusDetailsScreen from './src/pages/BusDetailsScreen';
import BookingConfirmationScreen from './src/pages/BookingConfirmationScreen';
import MyBookingsScreen from './src/pages/MyBookingsScreen';
import SeatSelectionScreen from './src/pages/SeatSelectionScreen';
import TicketScreen from './src/pages/TicketScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // User is logged in, show role-based screens
        <>
          {user.role === 'customer' && (
            <>
            <Stack.Screen name="CustomerHome" component={CustomerHome} />
            <Stack.Screen name="SearchBuses" component={SearchBusesScreen} />
        <Stack.Screen name="BusList" component={BusListScreen} />
        <Stack.Screen name="BusDetails" component={BusDetailsScreen} />
        <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />

        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
        </>

          )}
          {user.role === 'busowner' && (
            <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
          )}
          {user.role === 'admin' && (
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          )}
        </>
      ) : (
        // User is not logged in, show auth screens
        <>
          <Stack.Screen name="RoleSelector" component={RoleSelector} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import AuthProvider from './src/context/AuthContext';
// import useAuth from './src/context/AuthContext';
// // Auth screens
// import RoleSelector from './src/pages/auth/RoleSelector';
// import LoginScreen from './src/pages/auth/LoginScreen';
// import SignupScreen from './src/pages/auth/SignupScreen';

// // Role-based home screens
// import CustomerHome from './src/pages/CustomerHome';
// import OwnerDashboard from './src/pages/OwnerDashboard';
// import AdminDashboard from './src/pages/AdminDashboard';

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return null; // or a loading screen
//   }

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {user ? (
//         // User is logged in, show role-based screens
//         <>
//           {user.role === 'customer' && (
//   // Make sure your stack screens receive navigation props
// <Stack.Screen name="CustomerHome" component={CustomerHome} />
//           )}
//           {user.role === 'busowner' && (
//             <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
//           )}
//           {user.role === 'admin' && (
//             <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
//           )}
//         </>
//       ) : (
//         // User is not logged in, show auth screens
//         <>
//           <Stack.Screen name="RoleSelector" component={RoleSelector} />
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Signup" component={SignupScreen} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//     </AuthProvider>
//   );
// }