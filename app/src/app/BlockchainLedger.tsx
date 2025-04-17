import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Modal, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import blockchain, { Transaction, Wallet } from '../utils/Blockchain';

const BlockchainLedger = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [chainValid, setChainValid] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [blockDetailsVisible, setBlockDetailsVisible] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [miningMode, setMiningMode] = useState<'normal' | 'test' | 'instant'>(blockchain.getMiningMode());

  const loadBlockchainData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use requestAnimationFrame to prevent UI freezing
      requestAnimationFrame(() => {
        try {
          // Get transactions from blockchain
          const txs = blockchain.getAllTransactions();
          setTransactions(txs);
          
          // Get blockchain stats
          const blockchainStats = blockchain.getStats();
          setStats(blockchainStats);
          
          // Get all wallets
          const allWallets = blockchain.getAllWallets();
          setWallets(allWallets);
          
          // Validate blockchain
          const isValid = blockchain.isChainValid();
          setChainValid(isValid);

          // Get current mining mode
          setMiningMode(blockchain.getMiningMode());
          
          // Get chain data to extract pending transactions
          const chain = blockchain.getChain();
          const confirmed = chain.flatMap(block => block.transactions.map(tx => tx.id));
          const pending = txs.filter(tx => !confirmed.includes(tx.id));
          setPendingTransactions(pending);
        } catch (err) {
          console.error("Error processing blockchain data:", err);
        } finally {
          setIsLoading(false);
          setRefreshing(false);
        }
      });
    } catch (error) {
      console.error("Error loading blockchain data:", error);
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBlockchainData();
  };

  // Function to generate test blockchain data
  const generateTestData = async () => {
    try {
      setIsMining(true);
      Alert.alert("Generating Test Data", "Adding test transactions to blockchain...");
      await blockchain.addTestData(10);
      await loadBlockchainData();
      Alert.alert("Success", "Test data added to blockchain successfully!");
    } catch (error) {
      console.error("Error generating test data:", error);
      Alert.alert("Error", "Failed to generate test data. Please try again.");
    } finally {
      setIsMining(false);
    }
  };

  // Function to mine any pending transactions
  const mineTransactions = async () => {
    if (pendingTransactions.length === 0) {
      Alert.alert("No Transactions", "There are no pending transactions to mine.");
      return;
    }
    
    try {
      setIsMining(true);
      const result = await blockchain.mineNewBlock();
      if (result) {
        Alert.alert("Mining Successful", `Block #${result.id} has been mined successfully!`);
      } else {
        Alert.alert("Mining Failed", "Failed to mine the transactions. Try again later.");
      }
      await loadBlockchainData();
    } catch (error) {
      console.error("Error mining transactions:", error);
      Alert.alert("Mining Error", "An error occurred while mining. Please try again.");
    } finally {
      setIsMining(false);
    }
  };
  
  // Function to change the mining mode
  const changeMiningMode = () => {
    const modes: ('normal' | 'test' | 'instant')[] = ['normal', 'test', 'instant'];
    const currentIndex = modes.indexOf(miningMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    blockchain.setMiningMode(nextMode);
    setMiningMode(nextMode);
    
    Alert.alert(
      "Mining Mode Changed", 
      `Mining mode set to: ${nextMode}\n\n${
        nextMode === 'normal' ? 'Full proof-of-work mining (slower but more realistic)' :
        nextMode === 'test' ? 'Test mining with limited iterations (balanced)' :
        'Instant mining without proof-of-work (fastest)'
      }`
    );
  };

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  };

  const showBlockDetails = (blockId: number) => {
    setSelectedBlock(blockId);
    setBlockDetailsVisible(true);
  };

  const renderBlockDetails = () => {
    if (selectedBlock === null) return null;
    
    const block = blockchain.getBlockById(selectedBlock);
    if (!block) return null;
    
    return (
      <View className="bg-white rounded-lg p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-slate-800">Block #{block.id}</Text>
          <TouchableOpacity onPress={() => setBlockDetailsVisible(false)}>
            <Icon name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <View className="mb-3">
          <Text className="text-xs text-slate-500 mb-1">Time Mined</Text>
          <Text className="text-sm font-medium text-slate-700">{formatDate(block.timestamp)}</Text>
        </View>
        
        <View className="mb-3">
          <Text className="text-xs text-slate-500 mb-1">Difficulty</Text>
          <Text className="text-sm font-medium text-slate-700">{block.difficulty}</Text>
        </View>
        
        <View className="mb-3">
          <Text className="text-xs text-slate-500 mb-1">Nonce</Text>
          <Text className="text-sm font-medium text-slate-700">{block.nonce}</Text>
        </View>
        
        <View className="mb-3">
          <Text className="text-xs text-slate-500 mb-1">Block Hash</Text>
          <Text className="text-sm font-medium text-slate-700 break-all">{block.hash}</Text>
        </View>
        
        <View className="mb-3">
          <Text className="text-xs text-slate-500 mb-1">Previous Block Hash</Text>
          <Text className="text-sm font-medium text-slate-700 break-all">{block.previousHash}</Text>
        </View>
        
        <View className="mb-3">
          <Text className="text-xs text-slate-500 mb-1">Merkle Root</Text>
          <Text className="text-sm font-medium text-slate-700 break-all">{block.merkleRoot}</Text>
        </View>
        
        <View>
          <Text className="text-xs text-slate-500 mb-2">Transactions ({block.transactions.length})</Text>
          {block.transactions.map((tx, idx) => (
            <View key={tx.id} className="bg-slate-50 p-2 rounded mb-2">
              <Text className="text-xs font-medium text-slate-700">{tx.title}</Text>
              <Text className="text-xs text-slate-500">ID: {tx.id.substring(0, 8)}...</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 justify-between">
      <View className="flex-row justify-between items-center p-4 bg-slate-800">
        <Text className="text-xl font-bold text-white">Blockchain Ledger</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-slate-600 px-3 py-1.5 rounded"
          onPress={() => navigateTo('Ledger')}
        >
          <Icon name="arrow-back" size={20} color="#fff" />
          <Text className="text-white ml-1 text-sm">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800">Blockchain Explorer</Text>
          
          {/* Blockchain Status Indicator */}
          <View className="flex-row items-center bg-slate-100 rounded-full px-3 py-1.5">
            <View className={`w-3 h-3 rounded-full mr-2 ${chainValid ? 'bg-green-500' : 'bg-red-500'}`} />
            <Text className="text-sm font-medium">
              {chainValid ? 'Blockchain Verified' : 'Integrity Issue'}
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity 
            className={`flex-1 mr-2 py-3 px-4 rounded-xl flex-row items-center justify-center ${isMining ? 'bg-slate-300' : 'bg-blue-500'}`}
            onPress={mineTransactions}
            disabled={isMining || pendingTransactions.length === 0}
          >
            <Icon name="local-fire-department" size={20} color="#fff" />
            <Text className="text-white font-medium ml-2">
              {isMining ? 'Mining...' : 'Mine Transactions'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 ml-2 py-3 px-4 rounded-xl flex-row items-center justify-center ${isMining ? 'bg-slate-300' : 'bg-green-500'}`}
            onPress={generateTestData}
            disabled={isMining}
          >
            <Icon name="science" size={20} color="#fff" />
            <Text className="text-white font-medium ml-2">Test Data</Text>
          </TouchableOpacity>
        </View>
        
        {/* Mining Mode Selector */}
        <TouchableOpacity 
          className="mb-6 py-3 px-4 rounded-xl flex-row items-center justify-center bg-slate-200"
          onPress={changeMiningMode}
        >
          <Icon 
            name={
              miningMode === 'normal' ? 'format-list-numbered' : 
              miningMode === 'test' ? 'speed' : 'bolt'
            } 
            size={20} 
            color="#475569" 
          />
          <Text className="text-slate-700 font-medium ml-2">
            Mining Mode: {miningMode.charAt(0).toUpperCase() + miningMode.slice(1)}
          </Text>
          <Icon name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>
        
        {isLoading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-slate-600 mt-3">Loading blockchain data...</Text>
          </View>
        ) : (
          <>
            {/* Blockchain Stats Card */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow">
              <Text className="text-lg font-bold text-slate-800 mb-3">Blockchain Statistics</Text>
              
              <View className="flex-row flex-wrap justify-between">
                <View className="w-1/2 pr-2 mb-4">
                  <Text className="text-xs text-slate-500">BLOCKS MINED</Text>
                  <Text className="text-xl font-bold text-slate-800">{stats.blockCount || 0}</Text>
                </View>
                
                <View className="w-1/2 pl-2 mb-4">
                  <Text className="text-xs text-slate-500">TOTAL TRANSACTIONS</Text>
                  <Text className="text-xl font-bold text-slate-800">{stats.totalTransactions || 0}</Text>
                </View>
                
                <View className="w-1/2 pr-2 mb-4">
                  <Text className="text-xs text-slate-500">WALLETS</Text>
                  <Text className="text-xl font-bold text-slate-800">{stats.activeWallets || 0}</Text>
                </View>
                
                <View className="w-1/2 pl-2 mb-4">
                  <Text className="text-xs text-slate-500">DIFFICULTY</Text>
                  <Text className="text-xl font-bold text-slate-800">{stats.currentDifficulty || 2}</Text>
                </View>
                
                <View className="w-1/2 pr-2">
                  <Text className="text-xs text-slate-500">PENDING TXS</Text>
                  <Text className="text-xl font-bold text-slate-800">{pendingTransactions.length}</Text>
                </View>
                
                <View className="w-1/2 pl-2">
                  <Text className="text-xs text-slate-500">AVG BLOCK TIME</Text>
                  <Text className="text-xl font-bold text-slate-800">
                    {stats.averageBlockTime ? `${(stats.averageBlockTime / 1000).toFixed(2)}s` : 'N/A'}
                  </Text>
                </View>
              </View>
              
              {stats.lastMinedBlock > 0 && (
                <View className="mt-2 pt-2 border-t border-slate-100">
                  <Text className="text-xs text-slate-500">LAST BLOCK MINED</Text>
                  <Text className="text-sm text-slate-700">{formatTimeAgo(stats.lastMinedBlock)}</Text>
                </View>
              )}
            </View>
            
            {/* Recent Blocks */}
            <Text className="text-lg font-bold text-slate-800 mb-3">Recent Blocks</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              {blockchain.getChain().slice().reverse().slice(0, 5).map(block => (
                <TouchableOpacity 
                  key={block.id} 
                  className="bg-white rounded-xl p-4 mr-3 w-40 shadow"
                  onPress={() => showBlockDetails(block.id)}
                >
                  <View className="flex-row items-center mb-2">
                    <Icon name="cube" size={18} color="#3b82f6" />
                    <Text className="text-sm font-bold text-slate-800 ml-1">Block #{block.id}</Text>
                  </View>
                  <Text className="text-xs text-slate-500 mb-2">{formatTimeAgo(block.timestamp)}</Text>
                  <Text className="text-xs text-slate-600">{block.transactions.length} transactions</Text>
                  <View className="flex-row items-center mt-2 pt-2 border-t border-slate-100">
                    <Text className="text-xs text-blue-500">View Details</Text>
                    <Icon name="chevron-right" size={12} color="#3b82f6" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Pending Transactions */}
            {pendingTransactions.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-slate-800 mb-3">Pending Transactions</Text>
                
                {pendingTransactions.map(tx => {
                  const icon = getIconForType(tx.type);
                  return (
                    <View key={tx.id} className="bg-white rounded-xl p-4 mb-4 shadow border-l-4 border-amber-500">
                      <View className="flex-row items-center mb-2">
                        <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center mr-3">
                          <Icon name={icon.name} size={22} color="#f59e0b" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-slate-800">{tx.title}</Text>
                          <Text className="text-xs text-slate-500">{formatDate(tx.timestamp)}</Text>
                        </View>
                        <Text className={`text-base font-bold ${
                          tx.type === 'increase' ? 'text-green-500' : 
                          tx.type === 'expense' ? 'text-red-500' : 
                          'text-slate-800'
                        }`}>{tx.amount}</Text>
                      </View>
                      <Text className="text-sm text-slate-600">{tx.description}</Text>
                      
                      <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-slate-100">
                        <View className="flex-row items-center">
                          <Icon name="hourglass-empty" size={14} color="#f59e0b" />
                          <Text className="text-xs text-amber-600 ml-1">Waiting to be mined</Text>
                        </View>
                        <Text className="text-xs text-slate-500">
                          TX: {tx.id.substring(0, 8)}...{tx.id.substring(tx.id.length - 6)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            
            {/* Confirmed Transactions */}
            <Text className="text-lg font-bold text-slate-800 mb-3">Confirmed Transactions</Text>
            {transactions.filter(tx => !pendingTransactions.includes(tx)).slice(0, 5).map(tx => {
              const icon = getIconForType(tx.type);
              return (
                <View key={tx.id} className="bg-white rounded-xl p-4 mb-4 shadow">
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                      <Icon name={icon.name} size={22} color={icon.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-800">{tx.title}</Text>
                      <Text className="text-xs text-slate-500">{formatDate(tx.timestamp)}</Text>
                    </View>
                    <Text className={`text-base font-bold ${
                      tx.type === 'increase' ? 'text-green-500' : 
                      tx.type === 'expense' ? 'text-red-500' : 
                      'text-slate-800'
                    }`}>{tx.amount}</Text>
                  </View>
                  <Text className="text-sm text-slate-600">{tx.description}</Text>
                  
                  {/* Transaction details */}
                  <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <View className="flex-row items-center">
                      <Icon name="verified" size={14} color="#22c55e" />
                      <Text className="text-xs text-green-600 ml-1">Confirmed</Text>
                    </View>
                    <Text className="text-xs text-slate-500">
                      TX: {tx.id.substring(0, 8)}...{tx.id.substring(tx.id.length - 6)}
                    </Text>
                  </View>
                </View>
              );
            })}
            
            {/* Blockchain Info Card */}
            <View className="bg-blue-50 rounded-xl p-4 mb-8">
              <View className="flex-row items-center mb-2">
                <Icon name="shield" size={24} color="#3b82f6" />
                <Text className="text-base font-semibold text-slate-800 ml-2">
                  Blockchain Security
                </Text>
              </View>
              <Text className="text-sm text-slate-600 mb-3">
                All transactions are secured using blockchain technology. Each record is immutable 
                and cryptographically linked to maintain the integrity of budget data.
              </Text>
              <View className="p-3 bg-white rounded-lg">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-xs font-medium text-slate-600">Current Mode</Text>
                  <Text className="text-xs font-bold text-slate-800">{miningMode.charAt(0).toUpperCase() + miningMode.slice(1)}</Text>
                </View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-xs font-medium text-slate-600">Consensus</Text>
                  <Text className="text-xs font-bold text-slate-800">Nakamoto</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-medium text-slate-600">Merkle Tree</Text>
                  <Text className="text-xs font-bold text-slate-800">Enabled</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      
      {/* Block Details Modal */}
      <Modal
        visible={blockDetailsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBlockDetailsVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white rounded-xl w-full max-h-[80%]">
            <ScrollView className="p-4">
              {renderBlockDetails()}
            </ScrollView>
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

export default BlockchainLedger;