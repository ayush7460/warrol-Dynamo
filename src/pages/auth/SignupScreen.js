import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const { selectedRole, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Bus owner specific fields
    companyName: '',
    licenseNumber: '',
    aadhaarImage: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    // Bus owner specific validation
    if (selectedRole === 'busowner') {
      if (!formData.companyName || !formData.licenseNumber) {
        Alert.alert('Error', 'Please fill in all business details');
        return false;
      }
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const signupData = {
        ...formData,
        role: selectedRole
      };

      const result = await signup(signupData);
      
      if (result.success) {
        Alert.alert('Success', 'Account created successfully!');
        // Navigation will be handled by the main navigator based on user role
      } else {
        Alert.alert('Error', result.error || 'Signup failed');
        console.log('Signup result:', result);

      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarUpload = () => {
    // TODO: Implement image picker for Aadhaar upload
    Alert.alert('Info', 'Aadhaar upload feature will be implemented');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Create Account</Text>
          <Text className="text-gray-600">Sign up as {selectedRole}</Text>
        </View>

        <View className="space-y-4">
          {/* Common Fields */}
          <View>
            <Text className="text-gray-700 mb-1">Full Name *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1">Email *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1">Phone Number *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1">Password *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1">Confirm Password *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
            />
          </View>

          {/* Bus Owner Specific Fields */}
          {selectedRole === 'busowner' && (
            <>
              <View className="mt-6">
                <Text className="text-lg font-semibold text-gray-800 mb-4">Business Details</Text>
                
                <View className="mb-4">
                  <Text className="text-gray-700 mb-1">Company Name *</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChangeText={(value) => handleInputChange('companyName', value)}
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-gray-700 mb-1">License Number *</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="Enter your license number"
                    value={formData.licenseNumber}
                    onChangeText={(value) => handleInputChange('licenseNumber', value)}
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-gray-700 mb-1">Aadhaar Document *</Text>
                  <TouchableOpacity
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-center"
                    onPress={handleAadhaarUpload}
                  >
                    <Text className="text-gray-600">
                      {formData.aadhaarImage ? 'Document Uploaded' : 'Upload Aadhaar Document'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg mt-6"
            onPress={handleSignup}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 items-center">
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-blue-600 text-base">Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;


// // src/pages/auth/SignupScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useAuth } from '../../context/AuthContext';

// const SignupScreen = ({ navigation }) => {
//   const { selectedRole, signup } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     // Bus owner specific fields
//     companyName: '',
//     licenseNumber: '',
//     aadhaarImage: null
//   });

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const validateForm = () => {
//     const { name, email, phone, password, confirmPassword } = formData;
    
//     if (!name || !email || !phone || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return false;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return false;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return false;
//     }

//     // Bus owner specific validation
//     if (selectedRole === 'busowner') {
//       if (!formData.companyName || !formData.licenseNumber) {
//         Alert.alert('Error', 'Please fill in all business details');
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleSignup = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const signupData = {
//         ...formData,
//         role: selectedRole
//       };

//       const result = await signup(signupData);
      
//       if (result.success) {
//         Alert.alert('Success', 'Account created successfully!');
//         // Navigation will be handled by the main navigator based on user role
//       } else {
//         Alert.alert('Error', result.error || 'Signup failed');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred during signup');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAadhaarUpload = () => {
//     // TODO: Implement image picker for Aadhaar upload
//     Alert.alert('Info', 'Aadhaar upload feature will be implemented');
//   };

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       <View className="px-6 py-8">
//         <View className="items-center mb-8">
//           <Text className="text-2xl font-bold text-gray-800 mb-2">Create Account</Text>
//           <Text className="text-gray-600">Sign up as {selectedRole}</Text>
//         </View>

//         <View className="space-y-4">
//           {/* Common Fields */}
//           <View>
//             <Text className="text-gray-700 mb-1">Full Name *</Text>
//             <TextInput
//               className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChangeText={(value) => handleInputChange('name', value)}
//             />
//           </View>

//           <View>
//             <Text className="text-gray-700 mb-1">Email *</Text>
//             <TextInput
//               className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChangeText={(value) => handleInputChange('email', value)}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View>
//             <Text className="text-gray-700 mb-1">Phone Number *</Text>
//             <TextInput
//               className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//               placeholder="Enter your phone number"
//               value={formData.phone}
//               onChangeText={(value) => handleInputChange('phone', value)}
//               keyboardType="phone-pad"
//             />
//           </View>

//           <View>
//             <Text className="text-gray-700 mb-1">Password *</Text>
//             <TextInput
//               className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//               placeholder="Create a password"
//               value={formData.password}
//               onChangeText={(value) => handleInputChange('password', value)}
//               secureTextEntry
//             />
//           </View>

//           <View>
//             <Text className="text-gray-700 mb-1">Confirm Password *</Text>
//             <TextInput
//               className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//               placeholder="Confirm your password"
//               value={formData.confirmPassword}
//               onChangeText={(value) => handleInputChange('confirmPassword', value)}
//               secureTextEntry
//             />
//           </View>

//           {/* Bus Owner Specific Fields */}
//           {selectedRole === 'busowner' && (
//             <>
//               <View className="mt-6">
//                 <Text className="text-lg font-semibold text-gray-800 mb-4">Business Details</Text>
                
//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-1">Company Name *</Text>
//                   <TextInput
//                     className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//                     placeholder="Enter your company name"
//                     value={formData.companyName}
//                     onChangeText={(value) => handleInputChange('companyName', value)}
//                   />
//                 </View>

//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-1">License Number *</Text>
//                   <TextInput
//                     className="bg-white border border-gray-300 rounded-lg px-4 py-3"
//                     placeholder="Enter your license number"
//                     value={formData.licenseNumber}
//                     onChangeText={(value) => handleInputChange('licenseNumber', value)}
//                   />
//                 </View>

//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-1">Aadhaar Document *</Text>
//                   <TouchableOpacity
//                     className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-center"
//                     onPress={handleAadhaarUpload}
//                   >
//                     <Text className="text-gray-600">
//                       {formData.aadhaarImage ? 'Document Uploaded' : 'Upload Aadhaar Document'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </>
//           )}

//           <TouchableOpacity
//             className="bg-blue-600 py-4 rounded-lg mt-6"
//             onPress={handleSignup}
//             disabled={loading}
//           >
//             <Text className="text-white text-center font-semibold text-lg">
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View className="mt-6 items-center">
//           <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//             <Text className="text-blue-600 text-base">Already have an account? Login</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };
