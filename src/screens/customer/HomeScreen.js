import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationPicker, DatePicker } from '../components';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date(),
  });

  const handleSearch = () => {
    navigation.navigate('SearchResults', searchParams);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Find Your Bus</Text>
          <Text className="text-gray-600">Book tickets for your journey</Text>
        </View>

        {/* Search Form */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <LocationPicker
            label="From"
            value={searchParams.from}
            onSelect={(location) => 
              setSearchParams(prev => ({ ...prev, from: location }))
            }
          />

          <LocationPicker
            label="To"
            value={searchParams.to}
            onSelect={(location) => 
              setSearchParams(prev => ({ ...prev, to: location }))
            }
          />

          <DatePicker
            label="Travel Date"
            value={searchParams.date}
            onChange={(date) => 
              setSearchParams(prev => ({ ...prev, date }))
            }
            minDate={new Date()}
          />

          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg mt-4"
            onPress={handleSearch}
          >
            <Text className="text-white text-center font-semibold">
              Search Buses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Actions
          </Text>
          
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className="bg-white p-4 rounded-lg flex-1 mr-2 items-center"
              onPress={() => navigation.navigate('MyBookings')}
            >
              <Text className="text-blue-600 font-medium">My Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white p-4 rounded-lg flex-1 ml-2 items-center"
              onPress={() => navigation.navigate('SavedRoutes')}
            >
              <Text className="text-blue-600 font-medium">Saved Routes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;