import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Modal, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import blockchain from '../utils/Blockchain';

const PREDICTION_DATA = {
  predictions: {
    "-ONzs2fk7JCTl725OFRJ": {
      "Predicted_Allocated_Budget": 60170.87890625,
      "Reason": "Lower than expected possibly due to low priority or overallocation elsewhere.",
      "input": {
        "Dev_Index": 0,
        "GDP_Impact (%)": 34,
        "Ministry": "1",
        "Prev_Budget (Cr)": 23000,
        "Priority_Level": "0",
        "Projects_Count": 10,
        "Region_Impact": "1",
        "expected_budget": 1000000
      }
    },
    "-ONztOqljJbAP58lAqf6": {
      "Predicted_Allocated_Budget": 61931.1015625,
      "Reason": "Lower than expected possibly due to low priority or overallocation elsewhere.",
      "input": {
        "Dev_Index": 0,
        "GDP_Impact (%)": 34,
        "Ministry": "1",
        "Prev_Budget (Cr)": 23000,
        "Priority_Level": "09",
        "Projects_Count": 10,
        "Region_Impact": "1",
        "expected_budget": 10324000
      }
    },
    "-ONztRQGUwF3kjmqDl_p": {
      "Predicted_Allocated_Budget": 192892.28125,
      "Reason": "Lower than expected possibly due to low priority or overallocation elsewhere.",
      "input": {
        "Dev_Index": 0,
        "GDP_Impact (%)": 34,
        "Ministry": "9",
        "Prev_Budget (Cr)": 2302300,
        "Priority_Level": "09",
        "Projects_Count": 10,
        "Region_Impact": "1",
        "expected_budget": 324000
      }
    },
    "-ONztdFgKKTGA6urEp6s": {
      "Predicted_Allocated_Budget": 192890.578125,
      "Reason": "Lower than expected possibly due to low priority or overallocation elsewhere.",
      "input": {
        "Dev_Index": 0,
        "GDP_Impact (%)": 34,
        "Ministry": "2",
        "Prev_Budget (Cr)": 2302300,
        "Priority_Level": "7",
        "Projects_Count": 10,
        "Region_Impact": "3",
        "expected_budget": 324000
      }
    },
    "-ONztet1nq3JseMRCvUO": {
      "Predicted_Allocated_Budget": 154958.03125,
      "Reason": "Higher than expected due to high development index, priority, or ministry demand.",
      "input": {
        "Dev_Index": 0,
        "GDP_Impact (%)": 34,
        "Ministry": "2",
        "Prev_Budget (Cr)": 2302300,
        "Priority_Level": "7",
        "Projects_Count": 10,
        "Region_Impact": "3",
        "expected_budget": 3200
      }
    },
    "-ONztiPXaTTY7_HEGQaN": {
      "Predicted_Allocated_Budget": 13663.826171875,
      "Reason": "Higher than expected due to high development index, priority, or ministry demand.",
      "input": {
        "Dev_Index": 0,
        "GDP_Impact (%)": 34,
        "Ministry": "2",
        "Prev_Budget (Cr)": 2300,
        "Priority_Level": "7",
        "Projects_Count": 10,
        "Region_Impact": "3",
        "expected_budget": 3200
      }
    }
  }
};

const MINISTRY_CODE_MAP: Record<string, string> = {
  'Defence': '1',
  'Finance': '2',
  'Home Affairs': '3',
  'Education': '4',
  'Health': '5',
  'Agriculture': '6',
  'Railways': '7',
  'Commerce': '9'
};

const PRIORITY_LEVEL_MAP: Record<string, string> = {
  'High': '0',
  'Medium': '5',
  'Low': '9'
};

const REGION_IMPACT_MAP: Record<string, string> = {
  'Local': '0',
  'State': '1',
  'Regional': '2',
  'National': '3',
  'International': '4'
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<{
    budget: number | null,
    reason: string | null
  }>({
    budget: null,
    reason: null
  });
  const [showPrediction, setShowPrediction] = useState(false);

    type Prediction = {
      Predicted_Allocated_Budget: number;
      Reason: string;
      input: {
        Dev_Index: number;
        "GDP_Impact (%)": number;
        Ministry: string;
        "Prev_Budget (Cr)": number;
        Priority_Level: string;
        Projects_Count: number;
        Region_Impact: string;
        expected_budget: number;
      }
    };
  
    const findSimilarPrediction = (): Prediction | null => {
      const ministryCode = MINISTRY_CODE_MAP[formData.Ministry] || '1';
      const priorityCode = PRIORITY_LEVEL_MAP[formData.Priority_Level] || '9';
      const regionCode = REGION_IMPACT_MAP[formData.Region_Impact] || '3';
      const projectsCount = parseInt(formData.Projects_Count) || 10;
      const expectedBudget = parseInt(formData.expected_budget) || 200;
      const prevBudget = parseInt(formData.Prev_Budget) || 52000;
      const gdpImpact = parseFloat(formData.GDP_Impact) || 2.3;
      const devIndex = parseFloat(formData.Dev_Index) || 0.45;
  
      let bestMatch: Prediction | null = null;
      let highestScore = -1;

    Object.entries(PREDICTION_DATA.predictions).forEach(([key, prediction]) => {
      let score = 0;
      
      if (prediction.input.Ministry === ministryCode) {
        score += 5;
      }
      
      if (prediction.input.Priority_Level === priorityCode) {
        score += 3;
      }
      
      if (prediction.input.Region_Impact === regionCode) {
        score += 2;
      }
      
      const projectsDiff = Math.abs(prediction.input.Projects_Count - projectsCount) / 20;
      score += (1 - Math.min(projectsDiff, 1));

      const budgetDiff = Math.abs(prediction.input.expected_budget - expectedBudget) / 1000000;
      score += (1 - Math.min(budgetDiff, 1));

      if (score > highestScore) {
        highestScore = score;
        bestMatch = prediction;
      }
    });

    return bestMatch;
  };

  useEffect(() => {
    const prediction = findSimilarPrediction();
    if (prediction) {
      setPredictionResult({
        budget: prediction.Predicted_Allocated_Budget,
        reason: prediction.Reason
      });
    } else {
      setPredictionResult({
        budget: null,
        reason: null
      });
    }
  }, [formData]);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      console.log('Form submitted:', formData);
      
 
      const budgetAmount = `₹${parseInt(formData.expected_budget).toLocaleString('en-IN')} Cr`;
      const transactionTitle = `${formData.Ministry} Budget Allocation`;
      const transactionDescription = `Priority: ${formData.Priority_Level}, Region: ${formData.Region_Impact}, Projects: ${formData.Projects_Count}`;
      
      // Use a Promise with timeout to prevent the UI from freezing
      const addTransactionWithTimeout = () => {
        return new Promise<string>((resolve, reject) => {
          // Set a timeout to abort if it takes too long
          const timeoutId = setTimeout(() => {
            reject(new Error("Transaction processing timed out"));
          }, 10000); // 10 second timeout
          
          // Attempt to add the transaction
          blockchain.addTransaction({
            title: transactionTitle,
            description: transactionDescription,
            amount: budgetAmount,
            type: 'approval',
            fromAccount: 'Treasury',
            toAccount: formData.Ministry
          })
          .then(txId => {
            clearTimeout(timeoutId);
            resolve(txId);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
          });
        });
      };
      
      // Execute the transaction with the timeout wrapper
      const txId = await addTransactionWithTimeout();
      
      // Show success message with prediction information
      Alert.alert(
        "Transaction Recorded",
        `Budget request has been submitted and secured on the blockchain.\n\nPredicted allocation: ₹${predictionResult.budget ? Math.round(predictionResult.budget).toLocaleString('en-IN') : 'N/A'} Cr`,
        [
          { 
            text: "View Ledger", 
            onPress: () => navigateTo('Ledger') 
          },
          { 
            text: "Go to Dashboard", 
            onPress: () => navigateTo('Home') 
          }
        ]
      );
      
      // Reset form data after successful submission
      setFormData({
        Ministry: 'Defence',
        Priority_Level: 'Low',
        Projects_Count: '15',
        Region_Impact: 'National',
        Dev_Index: '0.45',
        expected_budget: '200',
        Prev_Budget: '52000',
        GDP_Impact: '2.3'
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage("Failed to submit budget request. Please try again.");
      Alert.alert('Error', 'Failed to submit budget request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Blockchain Info */}
          <View className="bg-blue-50 rounded-lg p-3 mb-4 flex-row items-center">
            <Icon name="verified" size={20} color="#3b82f6" />
            <Text className="text-sm text-slate-700 ml-2">
              This budget request will be secured on the blockchain for transparency and immutability
            </Text>
          </View>

          {/* Prediction Info */}
          {showPrediction && predictionResult.budget !== null && (
            <View className="bg-green-50 rounded-lg p-3 mb-4">
              <Text className="text-sm text-green-700">
                Predicted Allocation: ₹{Math.round(predictionResult.budget).toLocaleString('en-IN')} Cr
              </Text>
              <Text className="text-xs text-green-600 mt-1">
                Reason: {predictionResult.reason}
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 items-center mt-3"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-semibold">Submit Budget Request</Text>
            )}
          </TouchableOpacity>

          {errorMessage && (
            <View className="mt-4">
              <Text className="text-red-500 text-sm">{errorMessage}</Text>
            </View>
          )}
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
          onPress={() => setShowPrediction(!showPrediction)}
        >
          <Icon name="edit" size={24} color="#3b82f6" />
          <Text className="text-xs mt-1 text-blue-500 font-medium">Adjust</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Entry;
