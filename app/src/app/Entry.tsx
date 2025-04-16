import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];
const REGION_IMPACT_OPTIONS = ['Local', 'State', 'Regional', 'National', 'International'];
const MINISTRY_OPTIONS = [
  'Defence', 
  'Finance', 
  'Home Affairs', 
  'Education', 
  'Health', 
  'Agriculture', 
  'Railways', 
  'Commerce'
];

const API_CONFIG = {
  baseUrl: Platform.select({
    ios: 'http://localhost:5001',
    android: 'http://172.26.25.107:5001',
    default: 'http://localhost:5001'
  }),
  endpoints: {
    insertBudget: '/insert'
  }
};

const Entry = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [formData, setFormData] = useState({
    Ministry: 'Defence',
    Priority_Level: 'Low',
    Projects_Count: '15',
    Region_Impact: 'National',
    Dev_Index: '0.45',
    expected_budget: '200',
    Prev_Budget: '52000',
    GDP_Impact: '2.3'
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState({
    name: '',
    options: [] as string[],
  });

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Budget form submitted successfully!');
    navigateTo('Home');
  };

  const openDropdown = (name: string, options: string[]) => {
    setCurrentDropdown({ name, options });
    setModalVisible(true);
  };

  const selectItem = (item: string) => {
    handleChange(currentDropdown.name, item);
    setModalVisible(false);
  };

  const CustomDropdown = ({ 
    label, 
    value, 
    name,
    options 
  }: { 
    label: string, 
    value: string, 
    name: string,
    options: string[] 
  }) => {
    return (
      <View className="mb-5">
        <Text className="text-sm font-medium text-slate-800 mb-2">{label}</Text>
        <TouchableOpacity 
          className="bg-white border border-slate-300 rounded-lg p-3 flex-row justify-between items-center"
          onPress={() => openDropdown(name, options)}
        >
          <Text className="text-base text-slate-800">{value}</Text>
          <Icon name="arrow-drop-down" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 justify-between">
      <ScrollView className="flex-1">
        <View className="p-5">
          <Text className="text-2xl font-bold text-slate-800 mb-2 text-center">Budget Buddy</Text>
          <Text className="text-base text-slate-500 mb-6 text-center">Fill in the details for budget allocation</Text>

          {/* Ministry Dropdown */}
          <CustomDropdown
            label="Ministry"
            value={formData.Ministry}
            name="Ministry"
            options={MINISTRY_OPTIONS}
          />

          {/* Priority Level Dropdown */}
          <CustomDropdown
            label="Priority Level"
            value={formData.Priority_Level}
            name="Priority_Level"
            options={PRIORITY_LEVELS}
          />

          {/* Projects Count Input */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-slate-800 mb-2">Number of Projects</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800"
              value={formData.Projects_Count}
              onChangeText={(value) => handleChange('Projects_Count', value)}
              keyboardType="numeric"
              placeholder="Enter number of projects"
            />
          </View>

          {/* Region Impact Dropdown */}
          <CustomDropdown
            label="Region Impact"
            value={formData.Region_Impact}
            name="Region_Impact"
            options={REGION_IMPACT_OPTIONS}
          />

          {/* Development Index Input */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-slate-800 mb-2">Development Index (0-1)</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800"
              value={formData.Dev_Index}
              onChangeText={(value) => handleChange('Dev_Index', value)}
              keyboardType="decimal-pad"
              placeholder="Enter development index"
            />
          </View>

          {/* Expected Budget Input */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-slate-800 mb-2">Expected Budget (Cr)</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800"
              value={formData.expected_budget}
              onChangeText={(value) => handleChange('expected_budget', value)}
              keyboardType="numeric"
              placeholder="Enter expected budget"
            />
          </View>

          {/* Previous Budget Input */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-slate-800 mb-2">Previous Budget (Cr)</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800"
              value={formData.Prev_Budget}
              onChangeText={(value) => handleChange('Prev_Budget', value)}
              keyboardType="numeric"
              placeholder="Enter previous budget"
            />
          </View>

          {/* GDP Impact Input */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-slate-800 mb-2">GDP Impact (%)</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-lg p-3 text-base text-slate-800"
              value={formData.GDP_Impact}
              onChangeText={(value) => handleChange('GDP_Impact', value)}
              keyboardType="decimal-pad"
              placeholder="Enter GDP impact"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 items-center mt-3"
            onPress={handleSubmit}
          >
            <Text className="text-white text-base font-semibold">Submit Budget Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Dropdown Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl pb-5 max-h-[70%]">
            <View className="flex-row justify-between items-center p-4 border-b border-slate-200">
              <Text className="text-lg font-semibold text-slate-800">Select {currentDropdown.name.replace('_', ' ')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentDropdown.options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row justify-between items-center p-4 border-b border-slate-200"
                  onPress={() => selectItem(item)}
                >
                  <Text className="text-base text-slate-800">{item}</Text>
                  {formData[currentDropdown.name as keyof typeof formData] === item && (
                    <Icon name="check" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      <View className="flex-row justify-around items-center p-3 border-t border-slate-200 bg-white">
        <TouchableOpacity 
          className="items-center" 
          onPress={() => navigateTo('Home')}
        >
          <Icon name="dashboard" size={24} color="#64748b" />
          <Text className="text-xs mt-1 text-slate-500">Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="items-center" 
          onPress={() => navigateTo('Visualization')}
        >
          <Icon name="bar-chart" size={24} color="#64748b" />
          <Text className="text-xs mt-1 text-slate-500">Analysis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="items-center" 
          onPress={() => navigateTo('Ledger')}
        >
          <Icon name="book" size={24} color="#64748b" />
          <Text className="text-xs mt-1 text-slate-500">Ledger</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="items-center" 
          onPress={() => {}}
        >
          <Icon name="edit" size={24} color="#3b82f6" />
          <Text className="text-xs mt-1 text-blue-500 font-medium">Adjust</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Entry;
