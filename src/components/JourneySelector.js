import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const JourneySelector = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  const handleSearch = () => {
    // Search logic will be implemented later
    console.log('Searching buses...', { fromLocation, toLocation, departureDate });
  };

  return (
    <View className="bg-white mx-4 my-4 p-4 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold mb-4 text-gray-800">Search Buses</Text>
      
      <View className="mb-3">
        <Text className="text-gray-600 mb-1">From</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2 bg-gray-50"
          placeholder="Enter departure city"
          value={fromLocation}
          onChangeText={setFromLocation}
        />
      </View>

      <View className="mb-3">
        <Text className="text-gray-600 mb-1">To</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2 bg-gray-50"
          placeholder="Enter destination city"
          value={toLocation}
          onChangeText={setToLocation}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Departure Date</Text>
        <TouchableOpacity className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
          <Text className="text-gray-500">Select departure date</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        className="bg-blue-600 py-3 rounded-lg"
        onPress={handleSearch}
      >
        <Text className="text-white text-center font-semibold">Search Buses</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JourneySelector;