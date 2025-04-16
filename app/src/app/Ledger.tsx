import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Ledger = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const budgetEntries = [
    { 
      id: 1, 
      title: 'Q2 Budget Approval', 
      date: 'April 12, 2025', 
      amount: '₹68,25,000', 
      type: 'approval', 
      description: 'Quarterly budget approved for all departments'
    },
    { 
      id: 2, 
      title: 'Education Fund Increase', 
      date: 'April 5, 2025', 
      amount: '+₹12,50,000', 
      type: 'increase', 
      description: 'Additional funds allocated to education sector'
    },
    { 
      id: 3, 
      title: 'Fund Reallocation', 
      date: 'March 28, 2025', 
      amount: '₹8,75,000', 
      type: 'transfer', 
      description: 'Funds reallocated from infrastructure to healthcare'
    },
    { 
      id: 4, 
      title: 'Emergency Fund Release', 
      date: 'March 15, 2025', 
      amount: '-₹5,00,000', 
      type: 'expense', 
      description: 'Emergency funds released for disaster management'
    },
    { 
      id: 5, 
      title: 'Q1 Closing Report', 
      date: 'March 31, 2025', 
      amount: '₹54,30,000', 
      type: 'report', 
      description: 'Quarterly financial report for all departments'
    }
  ];

  const getIconForType = (type: string) => {
    switch(type) {
      case 'approval':
        return { name: 'assignment', color: '#3b82f6' };
      case 'increase':
        return { name: 'trending-up', color: '#22c55e' };
      case 'transfer':
        return { name: 'swap-horiz', color: '#f59e0b' };
      case 'expense':
        return { name: 'trending-down', color: '#ef4444' };
      case 'report':
        return { name: 'summarize', color: '#8b5cf6' };
      default:
        return { name: 'receipt', color: '#64748b' };
    }
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

      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold mb-6 text-slate-800">Transaction Ledger</Text>
        
        {budgetEntries.map((entry) => {
          const icon = getIconForType(entry.type);
          return (
            <View key={entry.id} className="bg-white rounded-xl p-4 mb-4 shadow">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                  <Icon name={icon.name} size={22} color={icon.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-800">{entry.title}</Text>
                  <Text className="text-xs text-slate-500">{entry.date}</Text>
                </View>
                <Text className={`text-base font-bold ${
                  entry.type === 'increase' ? 'text-green-500' : 
                  entry.type === 'expense' ? 'text-red-500' : 
                  'text-slate-800'
                }`}>{entry.amount}</Text>
              </View>
              <Text className="text-sm text-slate-600 ml-13">{entry.description}</Text>
            </View>
          );
        })}
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
          onPress={() => navigateTo('Visualization')}
        >
          <Icon name="bar-chart" size={24} color="#64748b" />
          <Text className="text-xs mt-1 text-slate-500">Analysis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="items-center" 
          onPress={() => {}}
        >
          <Icon name="book" size={24} color="#3b82f6" />
          <Text className="text-xs mt-1 text-blue-500 font-medium">Ledger</Text>
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

export default Ledger;
