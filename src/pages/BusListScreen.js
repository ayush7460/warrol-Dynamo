import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BusListScreen() {
  const navigation = useNavigation();
  const { from, to, date } = useRoute().params;

  // Replace below with real API data
  const buses = [
    { id: 1, name: 'Express 1', time: '10:00', price: 500 },
    { id: 2, name: 'Comfort 2', time: '14:00', price: 600 },
  ];

  return (
    <View style={{padding:24}}>
      <Text style={{fontSize:20, marginBottom:16}}>Buses from {from} to {to} on {date}:</Text>
      {buses.map(bus => (
        <View key={bus.id} style={{marginBottom:16}}>
          <Text>{bus.name} - {bus.time} - ₹{bus.price}</Text>
          <Button
            title="View Details"
            onPress={() => navigation.navigate('BusDetails', { busId: bus.id, from, to, date })}
          />
        </View>
      ))}
    </View>
  );
}