import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function SeatSelectionScreen() {
  const navigation = useNavigation();
  const [seat, setSeat] = useState('A1');
  const { busId, from, to, date } = useRoute().params;

  // For demonstration, just selecting a seat
  return (
    <View style={{padding:24}}>
      <Text style={{fontSize:18}}>Select your seat:</Text>
      <Text>Selected: {seat}</Text>
      <Button
        title="Confirm Booking"
        onPress={() => navigation.navigate('BookingConfirmation', { busId, seat, from, to, date })}
      />
    </View>
  );
}