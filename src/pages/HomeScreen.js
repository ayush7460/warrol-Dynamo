import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24, marginBottom: 24}}>Welcome to Bus Booking!</Text>
      <TouchableOpacity
        style={{backgroundColor: '#1e90ff', padding: 16, borderRadius: 8, marginBottom: 16}}
        onPress={() => navigation.navigate('SearchBuses')}
      >
        <Text style={{color: 'white', fontSize: 18}}>Search Buses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: '#4caf50', padding: 16, borderRadius: 8}}
        onPress={() => navigation.navigate('MyBookings')}
      >
        <Text style={{color: 'white', fontSize: 18}}>My Bookings</Text>
      </TouchableOpacity>
    </View>
  );
}