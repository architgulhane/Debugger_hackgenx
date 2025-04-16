import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Modal, FlatList } from 'react-native';
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

const Entry = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [formData, setFormData] = useState({
    Ministry: 'Defence',
    Priority_Level: 'low',
    Projects_Count: '15',
    Region_Impact: 'national',
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
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity 
          style={styles.dropdownSelector} 
          onPress={() => openDropdown(name, options)}
        >
          <Text style={styles.dropdownText}>{value}</Text>
          <Icon name="arrow-drop-down" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Budget Allocation Form</Text>
          <Text style={styles.formSubtitle}>Fill in the details for budget allocation</Text>

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
          <View style={styles.formGroup}>
            <Text style={styles.label}>Number of Projects</Text>
            <TextInput
              style={styles.input}
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
          <View style={styles.formGroup}>
            <Text style={styles.label}>Development Index (0-1)</Text>
            <TextInput
              style={styles.input}
              value={formData.Dev_Index}
              onChangeText={(value) => handleChange('Dev_Index', value)}
              keyboardType="decimal-pad"
              placeholder="Enter development index"
            />
          </View>

          {/* Expected Budget Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Expected Budget (Cr)</Text>
            <TextInput
              style={styles.input}
              value={formData.expected_budget}
              onChangeText={(value) => handleChange('expected_budget', value)}
              keyboardType="numeric"
              placeholder="Enter expected budget"
            />
          </View>

          {/* Previous Budget Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Previous Budget (Cr)</Text>
            <TextInput
              style={styles.input}
              value={formData.Prev_Budget}
              onChangeText={(value) => handleChange('Prev_Budget', value)}
              keyboardType="numeric"
              placeholder="Enter previous budget"
            />
          </View>

          {/* GDP Impact Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>GDP Impact (%)</Text>
            <TextInput
              style={styles.input}
              value={formData.GDP_Impact}
              onChangeText={(value) => handleChange('GDP_Impact', value)}
              keyboardType="decimal-pad"
              placeholder="Enter GDP impact"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Budget Request</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {currentDropdown.name.replace('_', ' ')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentDropdown.options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectItem(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                  {formData[currentDropdown.name as keyof typeof formData] === item && (
                    <Icon name="check" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigateTo('Home')} style={styles.navItem}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('Visualization')} style={styles.navItem}>
          <Icon name="bar-chart" size={24} color="#000" />
          <Text style={styles.navText}>Visualization</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('Ledger')} style={styles.navItem}>
          <Icon name="book" size={24} color="#000" />
          <Text style={styles.navText}>Ledger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name="edit" size={24} color="#3b82f6" />
          <Text style={[styles.navText, styles.navTextActive]}>Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a2b4b',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a2b4b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a2b4b',
  },
  dropdownSelector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a2b4b',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a2b4b',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1a2b4b',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navItemActive: {
    
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#64748b',
  },
  navTextActive: {
    color: '#3b82f6',
    fontWeight: '500',
  },
});

export default Entry;
