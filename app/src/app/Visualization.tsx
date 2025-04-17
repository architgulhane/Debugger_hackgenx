import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Modal, Alert, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import blockchain from '../utils/Blockchain';
import { BarChart, LineChart } from 'react-native-chart-kit';

const Visualization = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [blockSizes, setBlockSizes] = useState<number[]>([]);
  const [blockTimestamps, setBlockTimestamps] = useState<number[]>([]);
  const [blockTimes, setBlockTimes] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [chainValid, setChainValid] = useState(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get('window').width - 32;

  const loadBlockchainData = useCallback(async () => {
    setIsLoading(true);
    try {
      const chain = blockchain.getChain();
      const stats = blockchain.getStats();
      setStats(stats);
      const txs = blockchain.getAllTransactions();
      setTransactions(txs);
      const sizes = chain.map(block => block.transactions.length);
      setBlockSizes(sizes);
      const timestamps = chain.map(block => block.timestamp);
      setBlockTimestamps(timestamps);
      const times: number[] = [];
      for (let i = 1; i < chain.length; i++) {
        times.push(chain[i].timestamp - chain[i - 1].timestamp);
      }
      setBlockTimes(times);
      const isValid = blockchain.isChainValid();
      setChainValid(isValid);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [fadeAnim]);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBlockchainData();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderBlockSizeChart = () => {
    if (blockSizes.length <= 1) {
      return (
        <View className="items-center justify-center py-10">
          <Icon name="bar-chart" size={48} color="#cbd5e1" />
          <Text className="text-slate-400 mt-3 text-center">Not enough blocks to display chart</Text>
          <Text className="text-slate-400 text-center">Mine more blocks to see data</Text>
        </View>
      );
    }

    const labels = Array.from({ length: blockSizes.length }, (_, i) => `${i}`);

    return (
      <Animated.View style={{ opacity: fadeAnim }} className="bg-white rounded-xl p-4 shadow mb-6">
        <Text className="text-base font-bold text-slate-800 mb-4">Transactions Per Block</Text>
        <BarChart
          data={{
            labels: labels.slice(-7),
            datasets: [
              {
                data: blockSizes.slice(-7)
              }
            ]
          }}
          width={screenWidth}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726'
            }
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
        <Text className="text-xs text-center text-slate-500 mt-2">Block Number</Text>
      </Animated.View>
    );
  };

  const renderBlockTimeChart = () => {
    if (blockTimes.length <= 1) {
      return (
        <View className="items-center justify-center py-10">
          <Icon name="timeline" size={48} color="#cbd5e1" />
          <Text className="text-slate-400 mt-3 text-center">Not enough blocks to display chart</Text>
          <Text className="text-slate-400 text-center">Mine more blocks to see data</Text>
        </View>
      );
    }

    const blockTimesInSeconds = blockTimes.map(time => {
      const timeInSeconds = time / 1000;
      return timeInSeconds > 60 ? 60 : timeInSeconds;
    });

    const labels = Array.from({ length: blockTimesInSeconds.length }, (_, i) => `${i + 1}`);

    return (
      <Animated.View style={{ opacity: fadeAnim }} className="bg-white rounded-xl p-4 shadow mb-6">
        <Text className="text-base font-bold text-slate-800 mb-4">Block Mining Time (seconds)</Text>
        <LineChart
          data={{
            labels: labels.slice(-7),
            datasets: [
              {
                data: blockTimesInSeconds.slice(-7)
              }
            ]
          }}
          width={screenWidth}
          height={220}
          yAxisLabel=""
          yAxisSuffix="s"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#10b981'
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
        <Text className="text-xs text-center text-slate-500 mt-2">Block Number</Text>
      </Animated.View>
    );
  };

  const renderOverviewTab = () => {
    return (
      <>
        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <View className="flex-row items-center mb-4">
            <View className={`w-3 h-3 rounded-full mr-2 ${chainValid ? 'bg-green-500' : 'bg-red-500'}`} />
            <Text className="text-base font-semibold text-slate-800">
              {chainValid ? 'Blockchain Integrity: Valid' : 'Blockchain Integrity: Invalid'}
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-xs text-slate-500">BLOCKS MINED</Text>
              <Text className="text-xl font-bold text-slate-800">{stats.blockCount || 0}</Text>
            </View>

            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-xs text-slate-500">TOTAL TXS</Text>
              <Text className="text-xl font-bold text-slate-800">{stats.totalTransactions || 0}</Text>
            </View>

            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-xs text-slate-500">DIFFICULTY</Text>
              <Text className="text-xl font-bold text-slate-800">{stats.currentDifficulty || 2}</Text>
            </View>

            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-xs text-slate-500">MINING MODE</Text>
              <Text className="text-xl font-bold text-slate-800">{stats.miningMode?.charAt(0).toUpperCase() + stats.miningMode?.slice(1) || 'Test'}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="mt-2 py-2 flex-row items-center justify-center rounded-lg bg-slate-100"
            onPress={() => setShowTechnicalDetails(!showTechnicalDetails)}
          >
            <Icon name={showTechnicalDetails ? "expand-less" : "expand-more"} size={20} color="#64748b" />
            <Text className="text-slate-600 text-sm ml-1">
              {showTechnicalDetails ? "Hide Technical Details" : "Show Technical Details"}
            </Text>
          </TouchableOpacity>

          {showTechnicalDetails && (
            <View className="mt-4 pt-3 border-t border-slate-100">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-slate-500">HASH RATE</Text>
                <Text className="text-xs font-medium text-slate-700">
                  {stats.hashRate ? `${(stats.hashRate / 1000).toFixed(2)} kH/s` : 'N/A'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-slate-500">AVG BLOCK TIME</Text>
                <Text className="text-xs font-medium text-slate-700">
                  {stats.averageBlockTime ? `${(stats.averageBlockTime / 1000).toFixed(2)}s` : 'N/A'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-slate-500">PENDING TXS</Text>
                <Text className="text-xs font-medium text-slate-700">{stats.pendingTransactions || 0}</Text>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-slate-500">ACTIVE WALLETS</Text>
                <Text className="text-xs font-medium text-slate-700">{stats.activeWallets || 0}</Text>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-slate-500">CONSENSUS ALGORITHM</Text>
                <Text className="text-xs font-medium text-slate-700">Proof of Work</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-500">MERKLE TREE</Text>
                <Text className="text-xs font-medium text-slate-700">Enabled</Text>
              </View>
            </View>
          )}
        </View>

        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <Text className="text-base font-bold text-slate-800 mb-4">Transaction Types</Text>

          {transactions.length === 0 ? (
            <View className="items-center justify-center py-6">
              <Icon name="pie-chart" size={48} color="#cbd5e1" />
              <Text className="text-slate-400 mt-3 text-center">No transactions yet</Text>
            </View>
          ) : (
            <>
              {['approval', 'increase', 'expense', 'transfer', 'report'].map(type => {
                const count = transactions.filter(tx => tx.type === type).length;
                const percentage = transactions.length > 0 ? (count / transactions.length) * 100 : 0;

                return (
                  <View key={type} className="mb-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-sm font-medium text-slate-700 capitalize">{type}</Text>
                      <Text className="text-sm text-slate-600">{count} ({percentage.toFixed(1)}%)</Text>
                    </View>
                    <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <View
                        className={`h-full rounded-full ${
                          type === 'approval' ? 'bg-blue-500' :
                          type === 'increase' ? 'bg-green-500' :
                          type === 'expense' ? 'bg-red-500' :
                          type === 'transfer' ? 'bg-amber-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>

        {renderBlockSizeChart()}

        <TouchableOpacity
          className="bg-blue-50 rounded-xl p-4 mb-6 flex-row items-center justify-between"
          onPress={() => navigateTo('BlockchainLedger')}
        >
          <View className="flex-row items-center">
            <Icon name="explore" size={24} color="#3b82f6" />
            <Text className="text-base font-semibold text-slate-800 ml-2">
              Open Blockchain Explorer
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </>
    );
  };

  const renderPerformanceTab = () => {
    return (
      <>
        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <Text className="text-base font-bold text-slate-800 mb-4">Mining Performance</Text>

          <View className="flex-row flex-wrap justify-between mb-4">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-xs text-slate-500">DIFFICULTY</Text>
              <Text className="text-xl font-bold text-slate-800">{stats.currentDifficulty || 2}</Text>
            </View>

            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-xs text-slate-500">HASH RATE</Text>
              <Text className="text-xl font-bold text-slate-800">
                {stats.hashRate ? `${(stats.hashRate / 1000).toFixed(2)} kH/s` : 'N/A'}
              </Text>
            </View>

            <View className="w-1/2 pr-2">
              <Text className="text-xs text-slate-500">AVG BLOCK TIME</Text>
              <Text className="text-xl font-bold text-slate-800">
                {stats.averageBlockTime ? `${(stats.averageBlockTime / 1000).toFixed(2)}s` : 'N/A'}
              </Text>
            </View>

            <View className="w-1/2 pl-2">
              <Text className="text-xs text-slate-500">MINING MODE</Text>
              <Text className="text-xl font-bold text-slate-800">
                {stats.miningMode?.charAt(0).toUpperCase() + stats.miningMode?.slice(1) || 'Test'}
              </Text>
            </View>
          </View>

          <View className="py-3 px-4 bg-slate-50 rounded-lg">
            <Text className="text-xs text-slate-600 text-center">
              {stats.miningMode === 'normal' ?
                'Full proof-of-work mining provides the highest security but takes longer to mine blocks.' :
              stats.miningMode === 'test' ?
                'Test mining balances security and speed with limited proof-of-work iterations.' :
                'Instant mining skips proof-of-work for immediate block creation (development only).'}
            </Text>
          </View>
        </View>

        {renderBlockTimeChart()}

        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <Text className="text-base font-bold text-slate-800 mb-3">How Mining Works</Text>
          <Text className="text-sm text-slate-600 mb-3">
            Mining is the process of adding new blocks to the blockchain by solving a computational puzzle:
          </Text>

          <View className="mb-2 flex-row">
            <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Text className="text-blue-500 font-bold text-xs">1</Text>
            </View>
            <Text className="text-sm text-slate-600 flex-1">
              Pending transactions are grouped into a candidate block
            </Text>
          </View>

          <View className="mb-2 flex-row">
            <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Text className="text-blue-500 font-bold text-xs">2</Text>
            </View>
            <Text className="text-sm text-slate-600 flex-1">
              A merkle tree is created to efficiently verify transaction integrity
            </Text>
          </View>

          <View className="mb-2 flex-row">
            <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Text className="text-blue-500 font-bold text-xs">3</Text>
            </View>
            <Text className="text-sm text-slate-600 flex-1">
              Miners try different nonce values to find a hash that meets the difficulty target
            </Text>
          </View>

          <View className="mb-2 flex-row">
            <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Text className="text-blue-500 font-bold text-xs">4</Text>
            </View>
            <Text className="text-sm text-slate-600 flex-1">
              When a valid hash is found, the block is added to the blockchain
            </Text>
          </View>

          <View className="flex-row">
            <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Text className="text-blue-500 font-bold text-xs">5</Text>
            </View>
            <Text className="text-sm text-slate-600 flex-1">
              The difficulty adjusts automatically to maintain consistent block times
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-50 rounded-xl p-4 mb-6 flex-row items-center justify-between"
          onPress={() => navigateTo('BlockchainLedger')}
        >
          <View className="flex-row items-center">
            <Icon name="settings" size={24} color="#3b82f6" />
            <Text className="text-base font-semibold text-slate-800 ml-2">
              Blockchain Controls
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </>
    );
  };

  const renderSecurityTab = () => {
    return (
      <>
        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <View className="flex-row items-center mb-4">
            <Icon name="shield" size={24} color={chainValid ? "#22c55e" : "#ef4444"} />
            <Text className="text-base font-semibold text-slate-800 ml-2">
              {chainValid ? 'Blockchain Security: Strong' : 'Blockchain Security: Compromised'}
            </Text>
          </View>

          <View className="bg-slate-50 p-3 rounded-lg mb-4">
            <Text className="text-sm text-slate-600">
              {chainValid
                ? 'Your blockchain is secure. All blocks are valid and properly linked.'
                : 'Security issue detected! The blockchain has been tampered with.'}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">Security Features:</Text>

            <View className="flex-row items-center mb-2">
              <Icon name="check-circle" size={16} color="#22c55e" />
              <Text className="text-sm text-slate-600 ml-2">Cryptographic hashing (SHA-256)</Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Icon name="check-circle" size={16} color="#22c55e" />
              <Text className="text-sm text-slate-600 ml-2">Merkle tree for transaction verification</Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Icon name="check-circle" size={16} color="#22c55e" />
              <Text className="text-sm text-slate-600 ml-2">Proof-of-work consensus mechanism</Text>
            </View>

            <View className="flex-row items-center">
              <Icon name="check-circle" size={16} color="#22c55e" />
              <Text className="text-sm text-slate-600 ml-2">Immutable transaction history</Text>
            </View>
          </View>

          <TouchableOpacity
            className="py-2 bg-blue-500 rounded-lg items-center"
            onPress={() => {
              const isValid = blockchain.isChainValid();
              Alert.alert(
                "Blockchain Validation",
                isValid
                  ? "The blockchain has been validated and is secure."
                  : "Validation failed! The blockchain has been compromised."
              );
              setChainValid(isValid);
            }}
          >
            <Text className="text-white font-medium">Validate Blockchain</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <Text className="text-base font-bold text-slate-800 mb-3">Merkle Tree Technology</Text>

          <Text className="text-sm text-slate-600 mb-4">
            A Merkle tree efficiently verifies transaction integrity by creating a tree of hashes.
            This allows quick verification of whether a transaction is part of a block without
            checking the entire blockchain.
          </Text>

          <View className="items-center justify-center py-6 bg-slate-50 rounded-lg mb-4">
            <View className="items-center">
              <View className="w-16 h-10 bg-blue-500 rounded items-center justify-center mb-2">
                <Text className="text-white text-xs font-bold">Root Hash</Text>
              </View>

              <View className="w-40 h-0.5 bg-blue-300 mb-2" />

              <View className="flex-row justify-between w-40 mb-2">
                <View className="w-16 h-10 bg-blue-400 rounded items-center justify-center">
                  <Text className="text-white text-xs font-bold">Hash 1-2</Text>
                </View>
                <View className="w-16 h-10 bg-blue-400 rounded items-center justify-center">
                  <Text className="text-white text-xs font-bold">Hash 3-4</Text>
                </View>
              </View>

              <View className="flex-row justify-between w-40">
                <View className="w-0.5 h-6 bg-blue-300" style={{ marginLeft: 30 }} />
                <View className="w-0.5 h-6 bg-blue-300" style={{ marginLeft: 30 }} />
                <View className="w-0.5 h-6 bg-blue-300" style={{ marginLeft: 30 }} />
                <View className="w-0.5 h-6 bg-blue-300" style={{ marginLeft: 30 }} />
              </View>

              <View className="flex-row justify-between w-80">
                <View className="w-16 h-10 bg-green-400 rounded items-center justify-center">
                  <Text className="text-white text-xs font-bold">TX 1</Text>
                </View>
                <View className="w-16 h-10 bg-green-400 rounded items-center justify-center">
                  <Text className="text-white text-xs font-bold">TX 2</Text>
                </View>
                <View className="w-16 h-10 bg-green-400 rounded items-center justify-center">
                  <Text className="text-white text-xs font-bold">TX 3</Text>
                </View>
                <View className="w-16 h-10 bg-green-400 rounded items-center justify-center">
                  <Text className="text-white text-xs font-bold">TX 4</Text>
                </View>
              </View>
            </View>
          </View>

          <Text className="text-sm text-slate-600">
            In our implementation, the Merkle root is calculated for each block and stored in the blockchain.
            This ensures that any change to a transaction would be detected immediately during validation.
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <Text className="text-base font-bold text-slate-800 mb-3">Integrity Verification</Text>

          <Text className="text-sm text-slate-600 mb-4">
            Each block contains a cryptographic link to the previous block, creating an unbreakable chain.
            This prevents tampering with historical records.
          </Text>

          <View className="flex-row mb-4 overflow-hidden rounded-lg">
            <View className="bg-slate-100 p-3 flex-1">
              <Text className="text-xs text-slate-500 mb-1">PREVIOUS HASH</Text>
              <Text className="text-xs font-medium text-slate-700 break-all">0x8f4a...</Text>
            </View>
            <View className="bg-blue-100 p-3 flex-1">
              <Text className="text-xs text-blue-500 mb-1">CURRENT HASH</Text>
              <Text className="text-xs font-medium text-blue-700 break-all">0x9d3b...</Text>
            </View>
          </View>

          <Text className="text-sm text-slate-600 mb-4">
            During validation, the system:
          </Text>

          <View className="mb-2 flex-row">
            <Icon name="check" size={16} color="#22c55e" className="mt-0.5 mr-2" />
            <Text className="text-sm text-slate-600 flex-1">
              Recalculates each block's hash to verify it hasn't been altered
            </Text>
          </View>

          <View className="mb-2 flex-row">
            <Icon name="check" size={16} color="#22c55e" className="mt-0.5 mr-2" />
            <Text className="text-sm text-slate-600 flex-1">
              Validates that each block properly references the previous block
            </Text>
          </View>

          <View className="flex-row">
            <Icon name="check" size={16} color="#22c55e" className="mt-0.5 mr-2" />
            <Text className="text-sm text-slate-600 flex-1">
              Verifies the Merkle root to ensure transaction integrity
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-4 bg-slate-800">
        <Text className="text-xl font-bold text-white">Blockchain Analytics</Text>
      </View>

      <View className="flex-row bg-white border-b border-slate-200">
        <TouchableOpacity
          className={`flex-1 py-3 px-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('overview')}
        >
          <Text className={`text-center text-sm font-medium ${activeTab === 'overview' ? 'text-blue-500' : 'text-slate-600'}`}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 px-2 ${activeTab === 'performance' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('performance')}
        >
          <Text className={`text-center text-sm font-medium ${activeTab === 'performance' ? 'text-blue-500' : 'text-slate-600'}`}>Performance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 px-2 ${activeTab === 'security' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('security')}
        >
          <Text className={`text-center text-sm font-medium ${activeTab === 'security' ? 'text-blue-500' : 'text-slate-600'}`}>Security</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-slate-600 mt-3">Loading blockchain data...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'security' && renderSecurityTab()}
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
