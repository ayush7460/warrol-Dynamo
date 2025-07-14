import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Header = () => {
  return (
    <View className="bg-blue-600 px-4 py-3 pt-12">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-xl font-bold">BusBooking</Text>
        <TouchableOpacity className="bg-blue-700 px-3 py-1 rounded">
          <Text className="text-white text-sm">Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;