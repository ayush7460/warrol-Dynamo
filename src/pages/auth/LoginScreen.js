// src/pages/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Navigation will be handled by the main navigator based on user role
      } else {
        Alert.alert('Error', result.error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
        <Text className="text-gray-600">Sign in to your account</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-1">Email</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-1">Password</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg mt-6"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 items-center space-y-4">
        <TouchableOpacity>
          <Text className="text-blue-600 text-base">Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('RoleSelector')}>
          <Text className="text-blue-600 text-base">Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Demo Credentials */}
      <View className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <Text className="text-sm font-semibold text-yellow-800 mb-2">Demo Credentials:</Text>
        <Text className="text-sm text-yellow-700">Customer: customer@test.com / 123456</Text>
        <Text className="text-sm text-yellow-700">Bus Owner: owner@test.com / 123456</Text>
        <Text className="text-sm text-yellow-700">Admin: admin@test.com / 123456</Text>
      </View>
    </View>
  );
};

export default LoginScreen;
// // src/pages/auth/LoginScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { useAuth } from '../../context/AuthContext';

// const LoginScreen = ({ navigation }) => {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await login(email, password);
      
//       if (result.success) {
//         // Navigation will be handled by the main navigator based on user role
//       } else {
//         Alert.alert('Error', result.error || 'Login failed');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred during login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-gray-50 px-6 py-8">
//       <View className="items-center mb-8">
//         <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
//         <Text className="text-gray-600">Sign in to your account</Text>
//       </View>

//       <View className="space-y-4">
//         <View>
//           <Text className="text-gray-700 mb-1">Email</Text>
//           <TextInput
//             className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//             placeholder="Enter your email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>

//         <View>
//           <Text className="text-gray-700 mb-1">Password</Text>
//           <TextInput
//             className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//             placeholder="Enter your password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//         </View>

//         <TouchableOpacity
//           className="bg-blue-600 py-4 rounded-lg mt-6"
//           onPress={handleLogin}
//           disabled={loading}
//         >
//           <Text className="text-white text-center font-semibold text-lg">
//             {loading ? 'Signing In...' : 'Sign In'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View className="mt-8 items-center space-y-4">
//         <TouchableOpacity>
//           <Text className="text-blue-600 text-base">Forgot Password?</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={() => navigation.navigate('RoleSelector')}>
//           <Text className="text-blue-600 text-base">Don't have an account? Sign Up</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Demo Credentials */}
//       <View className="mt-8 p-4 bg-yellow-50 rounded-lg">
//         <Text className="text-sm font-semibold text-yellow-800 mb-2">Demo Credentials:</Text>
//         <Text className="text-sm text-yellow-700">Customer: customer@test.com / 123456</Text>
//         <Text className="text-sm text-yellow-700">Bus Owner: owner@test.com / 123456</Text>
//         <Text className="text-sm text-yellow-700">Admin: admin@test.com / 123456</Text>
//       </View>
//     </View>
//   );
// };

// export default LoginScreen;