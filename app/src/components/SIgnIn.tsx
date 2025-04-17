import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SignIn = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');

  const handleSignIn = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (userType === 'admin') {
      if (username === 'admin' && password === '1234') {
        navigateTo('AdminHome');
      } else {
        Alert.alert('Error', 'Invalid admin credentials');
      }
    } else {
      if (username === 'user' && password === '1234') {
        navigateTo('Home');
      } else {
        Alert.alert('Error', 'Invalid user credentials');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView 
        className="flex-grow"
        contentContainerStyle={{
          justifyContent: 'center',
          padding: 20
        }}
      >
        <View className="items-center mb-8">
          <Icon name="account-balance-wallet" size={50} color="#3b82f6" />
          <Text className="text-3xl font-bold text-slate-800 mt-2">Budget Buddy</Text>
          <Text className="text-base text-slate-500 mt-1">Sign in to your account</Text>
        </View>

        <View className="bg-white rounded-xl p-5 shadow">
          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1.5">Username</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 text-base bg-slate-50"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1.5">Password</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 text-base bg-slate-50"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1.5">Account Type</Text>
            <View className="border border-slate-200 rounded-lg bg-slate-50">
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                className="h-12"
              >
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-blue-500 rounded-lg p-4 items-center mt-2.5"
            onPress={handleSignIn}
          >
            <Text className="text-white text-base font-semibold">Sign In</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-5">
            <Text className="text-slate-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigateTo('Register')}>
              <Text className="text-blue-500 font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;