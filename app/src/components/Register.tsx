import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Register = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('user');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !name) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    navigateTo('SignIn');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView className="flex-grow justify-center p-5">
        <View className="items-center mb-8">
          <Icon name="app-registration" size={50} color="#3b82f6" />
          <Text className="text-3xl font-bold text-slate-800 mt-2">Budget Buddy</Text>
          <Text className="text-base text-slate-500 mt-1">Create your account</Text>
        </View>

        <View className="bg-white rounded-xl p-5 shadow">
          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1.5">Full Name</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 text-base bg-slate-50"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1.5">Email</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 text-base bg-slate-50"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1.5">Password</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 text-base bg-slate-50"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1.5">Confirm Password</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 text-base bg-slate-50"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
            onPress={handleRegister}
          >
            <Text className="text-white text-base font-semibold">Register</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-5">
            <Text className="text-slate-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigateTo('SignIn')}>
              <Text className="text-blue-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;