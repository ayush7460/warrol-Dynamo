import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BusDetailsScreen() {
  const navigation = useNavigation();
  const { busId, from, to, date } = useRoute().params;
  // Replace with real API data
  const bus = { id: busId, name: 'Express 1', time: '10:00', seats: 30 };

  return (
    <View style={{padding:24}}>
      <Text style={{fontSize:20}}>{bus.name}</Text>
      <Text>Leaves at: {bus.time}</Text>
      <Text>Available Seats: {bus.seats}</Text>
      <Button
        title="Select Seat"
        onPress={() => navigation.navigate('SeatSelection', { busId, from, to, date })}
      />
    </View>
  );
}