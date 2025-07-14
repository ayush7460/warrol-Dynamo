import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { busApi } from '../../services/busApi';
import { LoadingSpinner, ErrorMessage } from '../components';

const SearchResultsScreen = ({ route }) => {
  const { from, to, date } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({
    direct: [],
    connecting: []
  });

  useEffect(() => {
    loadSearchResults();
  }, []);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Search for both direct and connecting routes
      const routes = await busApi.searchBuses(from, to, date);
      
      setResults({
        direct: routes.direct || [],
        connecting: routes.connecting || []
      });
    } catch (err) {
      setError('Failed to load bus routes. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderBusItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white p-4 rounded-lg mb-3 shadow-sm"
      onPress={() => navigation.navigate('BusDetails', { busId: item.id })}
    >
      <View className="flex-row justify-between mb-2">
        <Text className="font-semibold text-lg">{item.busName}</Text>
        <Text className="text-green-600 font-semibold">₹{item.fare}</Text>
      </View>

      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-gray-600">{item.departureTime}</Text>
          <Text className="font-medium">{from}</Text>
        </View>

        <View>
          <Text className="text-gray-600">{item.duration}</Text>
          <Text className="text-gray-600 text-center">Duration</Text>
        </View>

        <View>
          <Text className="text-gray-600">{item.arrivalTime}</Text>
          <Text className="font-medium">{to}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">
          {item.availableSeats} seats available
        </Text>
        <View className="bg-blue-100 px-3 py-1 rounded">
          <Text className="text-blue-600">{item.busType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadSearchResults} />;

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-lg font-semibold mb-4">
        {from} to {to} • {new Date(date).toLocaleDateString()}
      </Text>

      {results.direct.length === 0 && results.connecting.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">No buses found</Text>
          <TouchableOpacity 
            className="mt-4 bg-blue-600 px-6 py-3 rounded-lg"
            onPress={loadSearchResults}
          >
            <Text className="text-white">Try Different Date</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={[...results.direct, ...results.connecting]}
          renderItem={renderBusItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default SearchResultsScreen;