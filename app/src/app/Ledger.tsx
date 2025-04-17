import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import blockchain, { Transaction } from '../utils/Blockchain';

const Ledger = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [blockchainVerified, setBlockchainVerified] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [miningMode, setMiningMode] = useState<'normal' | 'test' | 'instant'>(blockchain.getMiningMode());

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      requestAnimationFrame(() => {
        try {
          const txs = blockchain.getAllTransactions();
          setTransactions(txs);
          
          const isChainValid = blockchain.isChainValid();
          setBlockchainVerified(isChainValid);
          
          setMiningMode(blockchain.getMiningMode());
        } catch (err) {
          console.error("Error loading transactions:", err);
          setError("Failed to load transactions. Please try again.");
        } finally {
          setIsLoading(false);
          setRefreshing(false);
        }
      });
    } catch (error) {
      console.error("Error starting blockchain data loading:", error);
      setError("Failed to start loading. Please restart the app.");
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
  };

  const getDefaultEntries = () => {
    return [
      { 
        id: "default1", 
        title: 'Q2 Budget Approval', 
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, 
        amount: '₹68,25,000', 
        type: 'approval', 
        description: 'Quarterly budget approved for all departments'
      },
      { 
        id: "default2", 
        title: 'Education Fund Increase', 
        timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
        amount: '+₹12,50,000', 
        type: 'increase', 
        description: 'Additional funds allocated to education sector'
      },
      { 
        id: "default3", 
        title: 'Fund Reallocation', 
        timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000,
        amount: '₹8,75,000', 
        type: 'transfer', 
        description: 'Funds reallocated from infrastructure to healthcare'
      },
      { 
        id: "default4", 
        title: 'Emergency Fund Release', 
        timestamp: Date.now() - 33 * 24 * 60 * 60 * 1000,
        amount: '-₹5,00,000', 
        type: 'expense', 
        description: 'Emergency funds released for disaster management'
      },
      { 
        id: "default5", 
        title: 'Q1 Closing Report', 
        timestamp: Date.now() - 17 * 24 * 60 * 60 * 1000,
        amount: '₹54,30,000', 
        type: 'report', 
        description: 'Quarterly financial report for all departments'
      }
    ] as Transaction[];
  };

  const displayEntries = transactions.length > 0 ? transactions : getDefaultEntries();

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800">Transaction Ledger</Text>
          
          {/* Blockchain Verification Button */}
          <View className="flex-row items-center">
            {/* Blockchain Status Indicator */}
            <View className={`w-2.5 h-2.5 rounded-full mr-2 ${blockchainVerified ? 'bg-green-500' : 'bg-red-500'}`} />
            
            <TouchableOpacity 
              className="flex-row items-center bg-blue-100 px-3 py-2 rounded-lg"
              onPress={() => navigateTo('BlockchainLedger')}
            >
              <Icon name="verified" size={18} color="#3b82f6" />
              <Text className="text-blue-600 ml-1 text-sm font-medium">Blockchain</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {isLoading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-slate-600 mt-3">Loading transaction data...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-10">
            <Text className="text-red-500 mt-3">{error}</Text>
          </View>
        ) : (
          <>
            {displayEntries.map((entry) => {
              const icon = getIconForType(entry.type);
              return (
                <View key={entry.id} className="bg-white rounded-xl p-4 mb-4 shadow">
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                      <Icon name={icon.name} size={22} color={icon.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-800">{entry.title}</Text>
                      <Text className="text-xs text-slate-500">{formatDate(entry.timestamp)}</Text>
                    </View>
                    <Text className={`text-base font-bold ${
                      entry.type === 'increase' ? 'text-green-500' : 
                      entry.type === 'expense' ? 'text-red-500' : 
                      'text-slate-800'
                    }`}>{entry.amount}</Text>
                  </View>
                  <Text className="text-sm text-slate-600">{entry.description}</Text>
                  
                  {/* Show blockchain transaction ID if it's from blockchain (not a default entry) */}
                  {!entry.id.startsWith('default') && (
                    <View className="flex-row items-center mt-2 pt-2 border-t border-slate-100">
                      <Icon name="token" size={14} color="#3b82f6" />
                      <Text className="text-xs text-slate-500 ml-1">
                        TX: {entry.id.substring(0, 8)}...{entry.id.substring(entry.id.length - 6)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
            
            {/* Blockchain Info Card with Stats */}
            <TouchableOpacity 
              className="bg-blue-50 rounded-xl p-4 mb-8"
              onPress={() => navigateTo('BlockchainLedger')}
            >
              <View className="flex-row items-center mb-2">
                <Icon name="security" size={24} color="#3b82f6" />
                <Text className="text-base font-semibold text-slate-800 ml-2">
                  Blockchain Security
                </Text>
              </View>
              <Text className="text-sm text-slate-600 mb-3">
                All budget transactions are secured with blockchain technology for enhanced
                transparency and integrity. Explore the blockchain ledger for verified records.
              </Text>
              
              {/* Blockchain Stats */}
              <View className="bg-white rounded-lg p-3 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xs font-medium text-slate-600">Blocks Mined</Text>
                  <Text className="text-xs font-bold text-slate-800">
                    {Math.max(1, Math.ceil((transactions.length) / 3))}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xs font-medium text-slate-600">Transactions</Text>
                  <Text className="text-xs font-bold text-slate-800">{transactions.length}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs font-medium text-slate-600">Blockchain Status</Text>
                  <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-1.5 ${blockchainVerified ? 'bg-green-500' : 'bg-red-500'}`} />
                    <Text className="text-xs font-bold text-slate-800">
                      {blockchainVerified ? 'Verified' : 'Needs Verification'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View className="flex-row items-center justify-end">
                <Text className="text-blue-600 font-medium mr-1">View Blockchain Ledger</Text>
                <Icon name="arrow-forward" size={16} color="#3b82f6" />
              </View>
            </TouchableOpacity>
          </>
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
