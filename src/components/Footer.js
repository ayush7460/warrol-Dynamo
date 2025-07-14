import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Footer = () => {
  return (
    <View className="bg-gray-800 px-4 py-3">
      <View className="flex-row justify-around">
        <TouchableOpacity className="items-center">
          <Text className="text-white text-xs">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-white text-xs">My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-white text-xs">Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-white text-xs">Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;
