import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { busApi } from '../services/busApi';

const LocationPicker = ({ label, value, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = async (text) => {
    try {
      setLoading(true);
      const results = await busApi.searchLocations(text);
      setLocations(results);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-1">{label}</Text>
      
      <TouchableOpacity
        className="bg-white border border-gray-300 rounded-lg px-4 py-3"
        onPress={() => setModalVisible(true)}
      >
        <Text className={value ? "text-gray-900" : "text-gray-500"}>
          {value || `Select ${label}`}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200">
            <TextInput
              className="bg-gray-100 px-4 py-2 rounded-lg"
              placeholder="Search locations..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                if (text.length >= 2) {
                  searchLocations(text);
                }
              }}
            />
          </View>

          <FlatList
            data={locations}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 border-b border-gray-200"
                onPress={() => {
                  onSelect(item.name);
                  setModalVisible(false);
                  setSearchText('');
                }}
              >
                <Text className="text-gray-900">{item.name}</Text>
                <Text className="text-gray-600 text-sm">{item.state}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />

          <TouchableOpacity
            className="p-4 bg-gray-100"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-center text-blue-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LocationPicker;