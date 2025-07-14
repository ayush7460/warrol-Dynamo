import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Import all screens
import WelcomeScreen from '../pages/WelcomeScreen';
import LoginScreen from '../pages/auth/LoginScreen';
import RoleSelectorScreen from '../pages/RoleSelectorScreen';
import SignupScreen from '../pages/SignupScreen';

import HomeScreen from '../pages/HomeScreen';
import SearchBusesScreen from '../pages/SearchBusesScreen';
import BusListScreen from '../pages/BusListScreen';
import BusDetailsScreen from '../pages/BusDetailsScreen';
import SeatSelectionScreen from '../pages/SeatSelectionScreen';
import BookingConfirmationScreen from '../pages/BookingConfirmationScreen';
import TicketScreen from '../pages/TicketScreen';
import MyBookingsScreen from '../pages/MyBookingsScreen';
import ProfileScreen from '../pages/ProfileScreen';

// You can add more owner/admin screens here...

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Customer Tabs
const CustomerTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
    <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ tabBarLabel: "My Bookings" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Profile" }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a loading spinner

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // Main app
          <>
            <Stack.Screen name="CustomerApp" component={CustomerTabs} />
            <Stack.Screen name="SearchBuses" component={SearchBusesScreen} />
            <Stack.Screen name="BusList" component={BusListScreen} />
            <Stack.Screen name="BusDetails" component={BusDetailsScreen} />
            <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
            <Stack.Screen name="Ticket" component={TicketScreen} />
            {/* Add other screens as needed */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { useAuth } from '../context/AuthContext';
// import HomeScreen from '../pages/HomeScreen';
// import MyBookingsScreen from '../pages/MyBookingsScreen';
// import ProfileScreen from '../pages/ProfileScreen';
// import OwnerDashboardScreen from '../pages/OwnerDashboardScreen';
// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Customer Tab Navigator
// const CustomerTabs = () => (
//   <Tab.Navigator>
//     <Tab.Screen 
//       name="Home" 
//       component={HomeScreen} 
//       options={{
//         tabBarLabel: 'Home',
//         // Add icon configuration
//       }}
//     />
//     <Tab.Screen 
//       name="MyBookings" 
//       component={MyBookingsScreen}
//       options={{
//         tabBarLabel: 'My Bookings',
//         // Add icon configuration
//       }}
//     />
//     <Tab.Screen 
//       name="Profile" 
//       component={ProfileScreen}
//       options={{
//         tabBarLabel: 'Profile Settings',
//         // Add icon configuration
//       }}
//     />
//   </Tab.Navigator>
// );

// // Bus Owner Tab Navigator
// const BusOwnerTabs = () => (
//   <Tab.Navigator>
//     <Tab.Screen 
//       name="Dashboard" 
//       component={OwnerDashboardScreen}
//       options={{
//         tabBarLabel: 'Dashboard',
//         // Add icon configuration
//       }}
//     />
//     <Tab.Screen 
//       name="MyBuses" 
//       component={MyBusesScreen}
//       options={{
//         tabBarLabel: 'My Buses',
//         // Add icon configuration
//       }}
//     />
//     <Tab.Screen 
//       name="Bookings" 
//       component={BookingsManagementScreen}
//       options={{
//         tabBarLabel: 'Bookings',
//         // Add icon configuration
//       }}
//     />
//     <Tab.Screen 
//       name="Profile" 
//       component={ProfileScreen}
//       options={{
//         tabBarLabel: 'Profile ',
//         // Add icon configuration
//       }}
//     />
//   </Tab.Navigator>
// );

// const AppNavigator = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {!user ? (
//           // Auth Stack
//           <>
//             <Stack.Screen name="Welcome" component={WelcomeScreen} />
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
//             <Stack.Screen name="Signup" component={SignupScreen} />
//           </>
//         ) : (
//           // App Stacks based on user role
//           <>
//             {user.role === 'customer' && (
//               <Stack.Screen name="CustomerApp" component={CustomerTabs} />
//             )}
//             {user.role === 'busowner' && (
//               <Stack.Screen name="BusOwnerApp" component={BusOwnerTabs} />
//             )}
//             {user.role === 'admin' && (
//               <Stack.Screen name="AdminApp" component={AdminDashboardScreen} />
//             )}
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;