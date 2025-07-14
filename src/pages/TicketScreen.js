import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function TicketScreen() {
  const { bookingId } = useRoute().params;
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text style={{fontSize:24}}>Your Ticket</Text>
      <Text>Booking ID: {bookingId}</Text>
      {/* Replace with QR code or more ticket info */}
    </View>
  );
}