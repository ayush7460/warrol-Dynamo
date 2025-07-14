import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const AvailableBusesList = () => {
  // Mock data - will be replaced with real data later
  const mockBuses = [
    {
      id: 1,
      operatorName: 'Express Travels',
      busType: 'AC Sleeper',
      departureTime: '10:30 PM',
      arrivalTime: '06:00 AM',
      duration: '7h 30m',
      price: 850,
      availableSeats: 12
    },
    {
      id: 2,
      operatorName: 'Comfort Lines',
      busType: 'Non-AC Seater',
      departureTime: '11:00 PM',
      arrivalTime: '07:30 AM',
      duration: '8h 30m',
      price: 450,
      availableSeats: 8
    },
    {
      id: 3,
      operatorName: 'Royal Transport',
      busType: 'AC Seater',
      departureTime: '09:15 PM',
      arrivalTime: '05:45 AM',
      duration: '8h 30m',
      price: 650,
      availableSeats: 15
    }
  ];

  const handleBusSelect = (busId) => {
    // Navigation to seat selection will be implemented later
    console.log('Selected bus:', busId);
  };

  return (
    <View className="mx-4 mb-4">
      <Text className="text-lg font-semibold mb-4 text-gray-800">Available Buses</Text>
      
      {mockBuses.map((bus) => (
        <View key={bus.id} className="bg-white rounded-lg shadow-sm mb-3 p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{bus.operatorName}</Text>
              <Text className="text-sm text-gray-600">{bus.busType}</Text>
            </View>
            <Text className="text-lg font-bold text-blue-600">₹{bus.price}</Text>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-600">
                {bus.departureTime} → {bus.arrivalTime}
              </Text>
              <Text className="text-sm text-gray-500 ml-2">({bus.duration})</Text>
            </View>
            <Text className="text-sm text-green-600">{bus.availableSeats} seats left</Text>
          </View>

          <TouchableOpacity 
            className="bg-blue-600 py-2 rounded"
            onPress={() => handleBusSelect(bus.id)}
          >
            <Text className="text-white text-center font-semibold">Select Seats</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default AvailableBusesList;