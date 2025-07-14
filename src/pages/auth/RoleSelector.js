import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const RoleSelector = ({ navigation }) => {
  const { setSelectedRole } = useAuth();

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Book bus tickets and manage your travel',
      icon: '🎫'
    },
    {
      id: 'busowner',
      title: 'Bus Owner',
      description: 'Manage your bus fleet and bookings',
      icon: '🚌'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage the entire platform',
      icon: '⚙️'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    navigation.navigate('Signup');
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome to BusBooking</Text>
        <Text className="text-gray-600 text-center">Choose your role to get started</Text>
      </View>

      <View className="space-y-4">
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            onPress={() => handleRoleSelect(role.id)}
          >
            <View className="flex-row items-center">
              <Text className="text-4xl mr-4">{role.icon}</Text>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-800 mb-1">{role.title}</Text>
                <Text className="text-gray-600">{role.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-8 items-center">
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-blue-600 text-base">Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoleSelector;