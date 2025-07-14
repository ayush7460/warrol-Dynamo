import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../components/Header';
import JourneySelector from '../components/JourneySelector';
import AvailableBusesList from '../components/AvailableBusesList';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <ScrollView className="flex-1">
        <JourneySelector />
        <AvailableBusesList />
      </ScrollView>
      <Footer />
    </View>
  );
};

export default HomePage;