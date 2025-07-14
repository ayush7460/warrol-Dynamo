// src/pages/OwnerDashboard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Bus Owner Dashboard</Text>
        <Text className="text-gray-600">Welcome, {user?.name}!</Text>
        {user?.approved === false && (
          <View className="bg-yellow-100 p-3 rounded-lg mt-2">
            <Text className="text-yellow-800 text-sm text-center">
              Your account is pending approval by admin
            </Text>
          </View>
        )}
      </View>

      <View className="space-y-4">
        <TouchableOpacity className="bg-blue-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Manage Buses</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-green-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">View Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-purple-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Routes Management</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-orange-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Revenue Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Profile Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-red-600 p-4 rounded-lg mt-8"
        onPress={logout}
      >
        <Text className="text-white font-semibold text-center">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
export default OwnerDashboard;

// // src/pages/OwnerDashboard.js
// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { useAuth } from '../context/AuthContext';

// const OwnerDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <View className="flex-1 bg-gray-50 px-6 py-8">
//       <View className="items-center mb-8">
//         <Text className="text-2xl font-bold text-gray-800 mb-2">Bus Owner Dashboard</Text>
//         <Text className="text-gray-600">Welcome, {user?.name}!</Text>
//         {user?.approved === false && (
//           <View className="bg-yellow-100 p-3 rounded-lg mt-2">
//             <Text className="text-yellow-800 text-sm text-center">
//               Your account is pending approval by admin
//             </Text>
//           </View>
//         )}
//       </View>

//       <View className="space-y-4">
//         <TouchableOpacity className="bg-blue-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Manage Buses</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-green-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">View Bookings</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-purple-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Routes Management</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-orange-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Revenue Reports</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-gray-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Profile Settings</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         className="bg-red-600 p-4 rounded-lg mt-8"
//         onPress={logout}
//       >
//         <Text className="text-white font-semibold text-center">Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default OwnerDashboard;