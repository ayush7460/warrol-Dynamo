import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BookingConfirmationScreen() {
  const navigation = useNavigation();
  const { busId, seat, from, to, date } = useRoute().params;

  // Fake booking ID
  const bookingId = 'BK123456';

  return (
    <View style={{padding:24, justifyContent:'center', alignItems:'center'}}>
      <Text style={{fontSize:20, marginBottom:16}}>Booking Confirmed!</Text>
      <Text>Bus: {busId}</Text>
      <Text>Seat: {seat}</Text>
      <Text>Date: {date}</Text>
      <Button
        title="View Ticket"
        onPress={() => navigation.navigate('Ticket', { bookingId })}
      />
    </View>
  );
}