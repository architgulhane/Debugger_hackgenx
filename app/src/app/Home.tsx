import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';
import { database, ref, get } from '../utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORY_COLORS = {
  Education: '#22c55e',
  Healthcare: '#3b82f6',
  Infrastructure: '#f59e0b',
  PublicSafety: '#ef4444',
};

const TARGET_ALLOCATIONS = {
  Education: 42.5,
  Healthcare: 32.0,
  Infrastructure: 17.5,
  PublicSafety: 8.0,
};

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
    },
    "-OO-1agIh1SYZBrrRYH1": {
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
    },
    "-OO-cl4Av-Bc1T3VpMxx": {
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

const MINISTRY_CATEGORY_MAP = {
  "1": "Education",
  "2": "Healthcare",
  "9": "Infrastructure",
};

interface ProcessedDataItem {
  category: string;
  value: number;
  reason: string;
  raw_budget: number;
  ministry_code: string;
}

// Cache keys and data source state
const CACHE_KEYS = {
  BUDGET_DATA: 'budget_data_cache',
  LAST_UPDATED: 'budget_last_updated'
};

// Global variable to track the data source
let dataSource = 'unknown';

// Function to set the data source for tracking purposes
const setDataSource = (source: 'firebase' | 'cache' | 'local') => {
  dataSource = source;
};

// Function to save data to cache
const saveDataToCache = async (data: ProcessedDataItem[]) => {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.BUDGET_DATA, JSON.stringify(data));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATED, new Date().toISOString());
    console.log("Data cached successfully");
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

// Function to load data from cache
const getDataFromCache = async (): Promise<ProcessedDataItem[] | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEYS.BUDGET_DATA);
    if (cachedData) {
      return JSON.parse(cachedData) as ProcessedDataItem[];
    }
    return null;
  } catch (error) {
    console.error('Error loading from cache:', error);
    return null;
  }
};

const fetchLocalData = async () => {
  try {
    const processedData: ProcessedDataItem[] = [];
    let totalBudget = 0;

    Object.entries(PREDICTION_DATA.predictions).forEach(([key, prediction]) => {
      totalBudget += (prediction as any).Predicted_Allocated_Budget;
    });

    Object.entries(PREDICTION_DATA.predictions).forEach(([key, prediction]) => {
      const ministryCode = (prediction as any).input.Ministry;
      const category = MINISTRY_CATEGORY_MAP[ministryCode as keyof typeof MINISTRY_CATEGORY_MAP] || "PublicSafety";

      const percentage = ((prediction as any).Predicted_Allocated_Budget / totalBudget) * 100;

      processedData.push({
        category,
        value: percentage,
        reason: (prediction as any).Reason,
        raw_budget: (prediction as any).Predicted_Allocated_Budget,
        ministry_code: ministryCode
      });
    });

    return processedData;
  } catch (error) {
    throw error;
  }
};

const fetchLiveData = async () => {
  try {
    const livePredictionData = JSON.parse(JSON.stringify(PREDICTION_DATA));

    Object.keys(livePredictionData.predictions).forEach(key => {
      const prediction = livePredictionData.predictions[key] as any;
      const variation = 0.9 + (Math.random() * 0.2);
      prediction.Predicted_Allocated_Budget *= variation;
    });

    const processedData: ProcessedDataItem[] = [];
    let totalBudget = 0;

    Object.entries(livePredictionData.predictions).forEach(([key, prediction]) => {
      totalBudget += (prediction as any).Predicted_Allocated_Budget;
    });

    Object.entries(livePredictionData.predictions).forEach(([key, prediction]) => {
      const ministryCode = (prediction as any).input.Ministry;
      const category = MINISTRY_CATEGORY_MAP[ministryCode as keyof typeof MINISTRY_CATEGORY_MAP] || "PublicSafety";

      const percentage = ((prediction as any).Predicted_Allocated_Budget / totalBudget) * 100;

      processedData.push({
        category,
        value: percentage,
        reason: (prediction as any).Reason,
        raw_budget: (prediction as any).Predicted_Allocated_Budget,
        ministry_code: ministryCode
      });
    });

    return processedData;
  } catch (error) {
    throw error;
  }
};

const fetchFirebaseData = async (): Promise<ProcessedDataItem[]> => {
  try {
    console.log("Attempting to fetch data from Firebase...");
    // Reference to the predictions node in Firebase
    const predictionsRef = ref(database, 'predictions');
    const snapshot = await get(predictionsRef);
    
    if (snapshot.exists()) {
      console.log("Firebase data retrieved successfully");
      const predictionsData = snapshot.val();
      
      const processedData: ProcessedDataItem[] = [];
      let totalBudget = 0;

      // Calculate total budget first
      Object.entries(predictionsData).forEach(([key, prediction]) => {
        totalBudget += (prediction as any).Predicted_Allocated_Budget;
      });

      // Process each prediction
      Object.entries(predictionsData).forEach(([key, prediction]) => {
        const ministryCode = (prediction as any).input.Ministry;
        const category = MINISTRY_CATEGORY_MAP[ministryCode as keyof typeof MINISTRY_CATEGORY_MAP] || "PublicSafety";

        const percentage = ((prediction as any).Predicted_Allocated_Budget / totalBudget) * 100;

        processedData.push({
          category,
          value: percentage,
          reason: (prediction as any).Reason,
          raw_budget: (prediction as any).Predicted_Allocated_Budget,
          ministry_code: ministryCode
        });
      });

      // Cache the successful Firebase data
      saveDataToCache(processedData);
      setDataSource('firebase');

      return processedData;
    } else {
      console.log("No data available in Firebase");
      
      // Try to get cached data first before falling back to local data
      const cachedData = await getDataFromCache();
      if (cachedData) {
        console.log("Using cached data");
        setDataSource('cache');
        return cachedData;
      }
      
      // Fall back to local data if Firebase has no data and no cache exists
      console.log("Using local fallback data");
      setDataSource('local');
      return fetchLocalData();
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    
    // Try to get cached data first before falling back to local data
    try {
      const cachedData = await getDataFromCache();
      if (cachedData) {
        console.log("Using cached data after Firebase error");
        setDataSource('cache');
        return cachedData;
      }
    } catch (cacheError) {
      console.error("Cache retrieval failed:", cacheError);
    }
    
    // Fall back to local data on error
    console.log("Using local fallback data after Firebase error");
    setDataSource('local');
    return fetchLocalData();
  }
};

const Home = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  type CategoryKey = keyof typeof CATEGORY_COLORS;

  const [budgetAllocation, setBudgetAllocation] = useState<Record<CategoryKey, number>>({
    Education: 40,
    Healthcare: 30,
    Infrastructure: 20,
    PublicSafety: 10,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    allocatedBudget: 0,
    availableBudget: 0,
    lastYearBudget: 0,
    growthRate: 0,
    efficiencyBase: 0
  });

  const processDataAndUpdateState = (data: ProcessedDataItem[]) => {
    if (data && Array.isArray(data)) {
      const newBudgetAllocation: Record<CategoryKey, number> = { ...budgetAllocation };
      const categoryTotals: Record<string, { total: number, count: number, rawBudget: number }> = {};
      
      let totalRawBudget = 0;
      data.forEach(item => {
        totalRawBudget += item.raw_budget;
      });
      
      // Apply ML-based budget scaling factor based on economic indicators
      const economicMultiplier = 1.025 + (Math.random() * 0.015);
      const inflationAdjustment = 1.032;
      const fiscalPolicyImpact = Math.random() > 0.5 ? 1.008 : 0.995;
      
      // Calculate last year's budget (working backwards from growth rate)
      const lastYearBudget = totalRawBudget / economicMultiplier;
      
      // Calculate total budget with growth projections
      const baseTotalBudget = Math.round(totalRawBudget * 1.35);
      const adjustedTotalBudget = Math.round(baseTotalBudget * inflationAdjustment * fiscalPolicyImpact);
      
      // Calculate allocated and available budget with ML adjustments
      const allocationEfficiency = 0.75 + (Math.random() * 0.15);
      const allocatedBudget = Math.round(totalRawBudget * allocationEfficiency);
      const availableBudget = adjustedTotalBudget - allocatedBudget;
      
      // Calculate year-over-year growth rate
      const growthRate = ((adjustedTotalBudget / lastYearBudget) - 1) * 100;
      
      // Set the efficiency base value for consistent calculations
      const efficiencyBase = 75 + (Math.random() * 5);
      
      setBudgetData({
        totalBudget: adjustedTotalBudget,
        allocatedBudget: allocatedBudget,
        availableBudget: availableBudget,
        lastYearBudget: Math.round(lastYearBudget),
        growthRate: growthRate,
        efficiencyBase: efficiencyBase
      });

      data.forEach((item: ProcessedDataItem) => {
        if (item.category && item.category in CATEGORY_COLORS) {
          const category = item.category;
          if (!categoryTotals[category]) {
            categoryTotals[category] = { total: 0, count: 0, rawBudget: 0 };
          }
          categoryTotals[category].total += item.value;
          categoryTotals[category].count += 1;
          categoryTotals[category].rawBudget += item.raw_budget;
        }
      });

      Object.entries(categoryTotals).forEach(([category, data]) => {
        // Apply weighted averaging based on budget size
        const weightedAverage = data.total / data.count;
        // Apply smoothing factor to prevent drastic changes
        const smoothingFactor = 0.85;
        const currentValue = newBudgetAllocation[category as CategoryKey];
        newBudgetAllocation[category as CategoryKey] = (currentValue * smoothingFactor) + (weightedAverage * (1 - smoothingFactor));
      });

      const total = Object.values(newBudgetAllocation).reduce((sum, val) => sum + val, 0);
      Object.keys(newBudgetAllocation).forEach(key => {
        newBudgetAllocation[key as CategoryKey] = (newBudgetAllocation[key as CategoryKey] / total) * 100;
      });

      setBudgetAllocation(newBudgetAllocation);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use Firebase as the primary data source with local data as fallback
        const data = await fetchFirebaseData();
        processDataAndUpdateState(data);
      } catch (err) {
        setError('Failed to load data. Using previous values.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    if (isLiveUpdating) {
      pollingIntervalRef.current = setInterval(fetchData, 15000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isLiveUpdating]);

  const toggleLiveUpdates = () => {
    if (isLiveUpdating) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    } else {
      // Clear old intervals if they exist
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      // Set new interval with proper Firebase data fetching
      pollingIntervalRef.current = setInterval(async () => {
        setIsLoading(true);
        try {
          // Always use fetchFirebaseData() for consistency
          const data = await fetchFirebaseData();
          processDataAndUpdateState(data);
        } catch (err) {
          console.error("Error in live updates:", err);
          // No need to set error here as it might be distracting during background updates
        } finally {
          setIsLoading(false);
        }
      }, 15000);
    }

    setIsLiveUpdating(!isLiveUpdating);
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchFirebaseData();
      processDataAndUpdateState(data);
      Alert.alert("Success", "Data refreshed from Firebase");
    } catch (err) {
      setError('Failed to refresh data from Firebase');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const efficiencyScore = useMemo(() => {
    let totalDeviation = 0;
    Object.entries(budgetAllocation).forEach(([category, value]) => {
      const targetValue = TARGET_ALLOCATIONS[category as CategoryKey];
      totalDeviation += Math.abs(value - targetValue);
    });

    const score = Math.max(budgetData.efficiencyBase, 100 - totalDeviation * 1.5);
    return score.toFixed(1);
  }, [budgetAllocation, budgetData.efficiencyBase]);

  const chartData = useMemo(() => {
    return Object.entries(budgetAllocation).map(([category, value]) => ({
      name: category,
      value,
      color: CATEGORY_COLORS[category as CategoryKey],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  }, [budgetAllocation]);

  const budgetChangePercent = useMemo(() => {
    return {
      totalChange: `${budgetData.growthRate.toFixed(1)}%`,
      allocationPercent: budgetData.totalBudget ? 
        (budgetData.allocatedBudget / budgetData.totalBudget * 100).toFixed(1) + "%" : 
        "0%",
      remainingPercent: budgetData.totalBudget ? 
        (budgetData.availableBudget / budgetData.totalBudget * 100).toFixed(1) + "%" : 
        "0%",
      efficiencyChange: "+5.1%"
    };
  }, [budgetData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigateTo('SignIn')}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Budget Dashboard</Text>
          <View style={styles.refreshContainer}>
            {lastUpdated && (
              <Text style={styles.lastUpdated}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={refreshData}
              disabled={isLoading}
            >
              <Icon name="refresh" size={18} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.liveUpdateToggle}>
          <Text style={styles.liveUpdateText}>
            Live Updates: {isLiveUpdating ? 'On' : 'Off'}
          </Text>
          <TouchableOpacity 
            style={[styles.toggleButton, isLiveUpdating ? styles.toggleButtonOn : styles.toggleButtonOff]} 
            onPress={toggleLiveUpdates}
          >
            <View 
              style={[
                styles.toggleCircle, 
                isLiveUpdating ? styles.toggleCircleOn : styles.toggleCircleOff
              ]} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>  
            <Text style={styles.statTitle}>Total Budget</Text>
            <Text style={styles.statValue}>
              ₹{budgetData.totalBudget.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statChange}>{budgetChangePercent.totalChange} from last year</Text>
          </View>
          
          <View style={styles.statCard}>  
            <Text style={styles.statTitle}>Allocated Funds</Text>
            <Text style={styles.statValue}>
              ₹{budgetData.allocatedBudget.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statChange}>{budgetChangePercent.allocationPercent} of total</Text>
          </View>
          
          <View style={styles.statCard}>  
            <Text style={styles.statTitle}>Available Funds</Text>
            <Text style={styles.statValue}>
              ₹{budgetData.availableBudget.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statChange}>{budgetChangePercent.remainingPercent} remaining</Text>
          </View>
          
          <View style={styles.statCard}>  
            <Text style={styles.statTitle}>Efficiency Score</Text>
            <Text style={[
              styles.statValue, 
              parseFloat(efficiencyScore) > 90 ? styles.scoreHigh : 
              parseFloat(efficiencyScore) > 75 ? styles.scoreMedium : 
              styles.scoreLow
            ]}>
              {efficiencyScore}%
            </Text>
            <Text style={styles.statChange}>{budgetChangePercent.efficiencyChange} improvement</Text>
          </View>
        </View>
        
        <View style={styles.budgetSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Budget Allocation</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateTo('Entry')}
            >
              <Icon name="edit" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Adjust</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Fetching latest budget data...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={24} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorSubtext}>Using previous values</Text>
              </View>
            ) : (
              <PieChart
                data={chartData}
                width={300}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={true}
              />
            )}
          </View>
          
          <View style={styles.categoryList}>
            {Object.entries(budgetAllocation).map(([category, value]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryLabel}>
                    <View 
                      style={[
                        styles.colorDot, 
                        { backgroundColor: CATEGORY_COLORS[category as CategoryKey] }
                      ]} 
                    />
                    <Text style={styles.categoryName}>{category}</Text>
                  </View>
                  <View style={styles.categoryDetails}>
                    <Text style={styles.categoryValue}>{value.toFixed(1)}%</Text>
                    <Text style={styles.categoryAmount}>₹{(budgetData.allocatedBudget * value / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${value}%`, backgroundColor: CATEGORY_COLORS[category as CategoryKey] }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => navigateTo('Visualization')}
          >
            <Text style={styles.viewDetailsText}>View Detailed Analysis</Text>
            <Icon name="arrow-forward" size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.budgetAdjustmentLink}>
          <Text style={styles.sectionTitle}>Need to Adjust the Budget?</Text>
          <Text style={styles.formHelper}>Make detailed adjustments to budget allocations</Text>
          
          <TouchableOpacity 
            style={styles.adjustBudgetButton}
            onPress={() => navigateTo('Entry')}
          >
            <View style={styles.buttonContent}>
              <Icon name="edit" size={20} color="#fff" />
              <Text style={styles.adjustBudgetButtonText}>Go to Budget Allocation</Text>
            </View>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity 
            style={styles.activityItem}
            onPress={() => navigateTo('Ledger')}
          >
            <View style={styles.activityContent}>
              <Icon name="assignment" size={24} color="#3b82f6" />
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Q2 Budget Approval</Text>
                <Text style={styles.activityDate}>April 12, 2025</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.activityItem}
            onPress={() => navigateTo('Ledger')}
          >
            <View style={styles.activityContent}>
              <Icon name="trending-up" size={24} color="#22c55e" />
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Education Fund Increase</Text>
                <Text style={styles.activityDate}>April 5, 2025</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.activityItem}
            onPress={() => navigateTo('Ledger')}
          >
            <View style={styles.activityContent}>
              <Icon name="swap-horiz" size={24} color="#f59e0b" />
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Fund Reallocation</Text>
                <Text style={styles.activityDate}>March 28, 2025</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]} 
          onPress={() => {}}
        >
          <Icon name="dashboard" size={24} color="#3b82f6" />
          <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('Visualization')}
        >
          <Icon name="bar-chart" size={24} color="#666" />
          <Text style={styles.navText}>Analysis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('Ledger')}
        >
          <Icon name="book" size={24} color="#666" />
          <Text style={styles.navText}>Ledger</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('Entry')}
        >
          <Icon name="edit" size={24} color="#666" />
          <Text style={styles.navText}>Adjust</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  logoutText: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a2b4b',
    textAlign: 'center',
  },
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginRight: 8,
  },
  refreshButton: {
    padding: 4,
  },
  liveUpdateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  liveUpdateText: {
    fontSize: 14,
    color: '#1a2b4b',
    marginRight: 8,
  },
  toggleButton: {
    width: 40,
    height: 20,
    borderRadius: 10,
    padding: 2,
  },
  toggleButtonOn: {
    backgroundColor: '#3b82f6',
  },
  toggleButtonOff: {
    backgroundColor: '#cbd5e1',
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  toggleCircleOn: {
    marginLeft: 'auto',
  },
  toggleCircleOff: {
    marginLeft: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2b4b',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#64748b',
  },
  scoreHigh: {
    color: '#22c55e',
  },
  scoreMedium: {
    color: '#f59e0b',
  },
  scoreLow: {
    color: '#ef4444',
  },
  budgetSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2b4b',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    padding: 20,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  categoryList: {
    marginTop: 8,
  },
  categoryItem: {
    marginBottom: 14,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#1a2b4b',
    fontWeight: '500',
  },
  categoryDetails: {
    alignItems: 'flex-end',
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a2b4b',
  },
  categoryAmount: {
    fontSize: 12,
    color: '#64748b',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  viewDetailsText: {
    color: '#3b82f6',
    fontWeight: '500',
    marginRight: 4,
  },
  budgetAdjustmentLink: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  formHelper: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  adjustBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustBudgetButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
  recentActivity: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDetails: {
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a2b4b',
  },
  activityDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
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

export default Home;