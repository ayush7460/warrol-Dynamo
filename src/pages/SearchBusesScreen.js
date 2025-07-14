import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SearchBusesScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigation = useNavigation();

  return (
    <View style={{padding:24}}>
      <Text style={{fontSize:18}}>From:</Text>
      <TextInput value={from} onChangeText={setFrom} placeholder="Origin" style={{borderBottomWidth:1}} />
      <Text style={{fontSize:18}}>To:</Text>
      <TextInput value={to} onChangeText={setTo} placeholder="Destination" style={{borderBottomWidth:1}} />
      <Text style={{fontSize:18}}>Date:</Text>
      <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" style={{borderBottomWidth:1, marginBottom:24}} />
      <Button
        title="Search"
        onPress={() => navigation.navigate('BusList', { from, to, date })}
      />
    </View>
  );
}