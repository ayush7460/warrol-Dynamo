import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const tokenStorage = {
  saveToken: async (token) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  
  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
  
  removeToken: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
  
  saveUser: async (userData) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  },
  
  getUser: async () => {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }
};