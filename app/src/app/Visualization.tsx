import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Visualization = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [activeTab, setActiveTab] = useState('performance');

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const performanceData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        data: [85, 92, 88, 95],
        color: () => '#3b82f6',
        strokeWidth: 2,
      }
    ],
  };

  const allocationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [40, 39, 42, 45, 43, 40],
        color: () => '#22c55e',
        strokeWidth: 2,
        label: 'Education'
      },
      {
        data: [30, 28, 31, 30, 29, 32],
        color: () => '#3b82f6',
        strokeWidth: 2,
        label: 'Healthcare'
      },
      {
        data: [20, 21, 18, 16, 19, 20],
        color: () => '#f59e0b',
        strokeWidth: 2,
        label: 'Infrastructure'
      },
      {
        data: [10, 12, 9, 9, 9, 8],
        color: () => '#ef4444',
        strokeWidth: 2,
        label: 'Public Safety'
      }
    ],
    legend: ['Education', 'Healthcare', 'Infrastructure', 'Public Safety']
  };

  const comparisonData = {
    labels: ['Education', 'Healthcare', 'Infrastructure', 'Safety'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        label: 'Current'
      },
      {
        data: [42.5, 32, 17.5, 8],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        label: 'Target'
      }
    ],
    legend: ['Current', 'Target']
  };

  return (
    <View className="flex-1 bg-slate-50 justify-between">
      <View className="flex-row justify-between items-center p-4 bg-slate-800">
        <Text className="text-xl font-bold text-white">Budget Buddy</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-slate-600 px-3 py-1.5 rounded"
          onPress={() => navigateTo('SignIn')}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text className="text-white ml-1 text-sm">Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-800 mb-4">Budget Analysis</Text>
        
        <View className="flex-row bg-slate-100 rounded-lg p-1 mb-4">
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'performance' ? 'bg-white shadow' : ''}`}
            onPress={() => setActiveTab('performance')}
          >
            <Text className={`text-center text-sm font-medium ${activeTab === 'performance' ? 'text-blue-500' : 'text-slate-500'}`}>
              Performance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'trends' ? 'bg-white shadow' : ''}`}
            onPress={() => setActiveTab('trends')}
          >
            <Text className={`text-center text-sm font-medium ${activeTab === 'trends' ? 'text-blue-500' : 'text-slate-500'}`}>
              Trends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'comparison' ? 'bg-white shadow' : ''}`}
            onPress={() => setActiveTab('comparison')}
          >
            <Text className={`text-center text-sm font-medium ${activeTab === 'comparison' ? 'text-blue-500' : 'text-slate-500'}`}>
              Comparison
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView className="flex-1 px-4">
        {activeTab === 'performance' && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow">
            <Text className="text-lg font-bold text-slate-800 mb-3">Budget Efficiency Score</Text>
            <Text className="text-sm text-slate-500 mb-4">Quarterly performance metrics</Text>
            
            <LineChart
              data={performanceData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 8, marginBottom: 16 }}
            />
            
            <View className="mt-2">
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-slate-600">Average Score</Text>
                <Text className="text-sm font-bold text-slate-800">90%</Text>
              </View>
              <View className="flex-row justify-between py-2 border-t border-slate-100">
                <Text className="text-sm text-slate-600">Highest Score</Text>
                <Text className="text-sm font-bold text-green-500">95%</Text>
              </View>
              <View className="flex-row justify-between py-2 border-t border-slate-100">
                <Text className="text-sm text-slate-600">Lowest Score</Text>
                <Text className="text-sm font-bold text-amber-500">85%</Text>
              </View>
              <View className="flex-row justify-between py-2 border-t border-slate-100">
                <Text className="text-sm text-slate-600">YoY Improvement</Text>
                <Text className="text-sm font-bold text-green-500">+7.5%</Text>
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'trends' && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow">
            <Text className="text-lg font-bold text-slate-800 mb-3">Budget Allocation Trends</Text>
            <Text className="text-sm text-slate-500 mb-4">6-month allocation history</Text>
            
            <LineChart
              data={allocationTrendData}
              width={screenWidth - 48}
              height={250}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              bezier
              style={{ borderRadius: 8, marginBottom: 16 }}
              fromZero
              yAxisLabel=""
              yAxisSuffix="%"
              verticalLabelRotation={30}
            />
            
            <View className="p-4 bg-slate-50 rounded-lg mt-2">
              <Text className="text-sm font-medium text-slate-800 mb-2">Key Insights:</Text>
              <Text className="text-xs text-slate-600 mb-1">• Education allocation shows upward trend</Text>
              <Text className="text-xs text-slate-600 mb-1">• Healthcare spending stable with slight variations</Text>
              <Text className="text-xs text-slate-600 mb-1">• Infrastructure allocation decreased in March-April</Text>
              <Text className="text-xs text-slate-600">• Public Safety had minor fluctuations within target range</Text>
            </View>
          </View>
        )}
        
        {activeTab === 'comparison' && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow">
            <Text className="text-lg font-bold text-slate-800 mb-3">Current vs Target Allocation</Text>
            <Text className="text-sm text-slate-500 mb-4">Comparison with recommended allocations</Text>
            
            <BarChart
              data={comparisonData}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                ...chartConfig,
                barPercentage: 0.6,
              }}
              style={{ borderRadius: 8, marginBottom: 16 }}
              fromZero
              yAxisLabel=""
              yAxisSuffix="%"
              showValuesOnTopOfBars
            />
            
            <View className="flex-row mt-2 mb-2">
              <View className="flex-row items-center mr-4">
                <View className="w-3 h-3 rounded-full bg-blue-500 mr-1"></View>
                <Text className="text-xs text-slate-600">Current</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-green-500 mr-1"></View>
                <Text className="text-xs text-slate-600">Target</Text>
              </View>
            </View>
            
            <View className="p-4 bg-slate-50 rounded-lg mt-2">
              <Text className="text-sm font-medium text-slate-800 mb-2">Deviation Analysis:</Text>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-slate-600">Education</Text>
                <Text className="text-xs text-red-500">-2.5% under target</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-slate-600">Healthcare</Text>
                <Text className="text-xs text-red-500">-2.0% under target</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-slate-600">Infrastructure</Text>
                <Text className="text-xs text-green-500">+2.5% over target</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-600">Public Safety</Text>
                <Text className="text-xs text-green-500">+2.0% over target</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
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
          onPress={() => {}}
        >
          <Icon name="bar-chart" size={24} color="#3b82f6" />
          <Text className="text-xs mt-1 text-blue-500 font-medium">Analysis</Text>
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
          onPress={() => navigateTo('Entry')}
        >
          <Icon name="edit" size={24} color="#64748b" />
          <Text className="text-xs mt-1 text-slate-500">Adjust</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Visualization;
