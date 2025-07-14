import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</Text>
        <Text className="text-gray-600">Welcome, {user?.name}!</Text>
      </View>

      <View className="space-y-4">
        <TouchableOpacity className="bg-blue-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Approve Bus Owners</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-green-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Manage Users</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-purple-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">System Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-orange-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Platform Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-indigo-600 p-4 rounded-lg">
          <Text className="text-white font-semibold text-center">Revenue Management</Text>
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

export default AdminDashboard;


// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { useAuth } from '../context/AuthContext';

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();

//   return (
//     <View className="flex-1 bg-gray-50 px-6 py-8">
//       <View className="items-center mb-8">
//         <Text className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</Text>
//         <Text className="text-gray-600">Welcome, {user?.name}!</Text>
//       </View>

//       <View className="space-y-4">
//         <TouchableOpacity className="bg-blue-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Approve Bus Owners</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-green-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Manage Users</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-purple-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">System Analytics</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-orange-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Platform Settings</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-indigo-600 p-4 rounded-lg">
//           <Text className="text-white font-semibold text-center">Revenue Management</Text>
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

// export default AdminDashboard;
