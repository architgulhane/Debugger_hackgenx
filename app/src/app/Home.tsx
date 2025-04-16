import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';

// Define colors for budget categories
const CATEGORY_COLORS = {
  Education: '#22c55e',
  Healthcare: '#3b82f6',
  Infrastructure: '#f59e0b',
  PublicSafety: '#ef4444',
};

// Define target allocations for efficiency calculation
const TARGET_ALLOCATIONS = {
  Education: 42.5,
  Healthcare: 32.0,
  Infrastructure: 17.5,
  PublicSafety: 8.0,
};

const Home = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  type CategoryKey = keyof typeof CATEGORY_COLORS;
  
  // Budget allocation state
  const [budgetAllocation, setBudgetAllocation] = useState<Record<CategoryKey, number>>({
    Education: 40,
    Healthcare: 30,
    Infrastructure: 20,
    PublicSafety: 10,
  });
  
  // Calculate efficiency score based on how close we are to target allocations
  const efficiencyScore = useMemo(() => {
    let totalDeviation = 0;
    Object.entries(budgetAllocation).forEach(([category, value]) => {
      const targetValue = TARGET_ALLOCATIONS[category as CategoryKey];
      totalDeviation += Math.abs(value - targetValue);
    });
    
    // Higher score for lower deviation
    const score = Math.max(60, 100 - totalDeviation * 1.5);
    return score.toFixed(1);
  }, [budgetAllocation]);

  // Format data for pie chart
  const chartData = useMemo(() => {
    return Object.entries(budgetAllocation).map(([category, value]) => ({
      name: category,
      value,
      color: CATEGORY_COLORS[category as CategoryKey],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  }, [budgetAllocation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Budget Dashboard</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>  
            <Text style={styles.statTitle}>Total Budget</Text>
            <Text style={styles.statValue}>₹2,45,00,000</Text>
            <Text style={styles.statChange}>+2.5% from last year</Text>
          </View>
          
          <View style={styles.statCard}>  
            <Text style={styles.statTitle}>Allocated Funds</Text>
            <Text style={styles.statValue}>₹1,80,86,262</Text>
            <Text style={styles.statChange}>73.7% of total</Text>
          </View>
          
          <View style={styles.statCard}>  
            <Text style={styles.statTitle}>Available Funds</Text>
            <Text style={styles.statValue}>₹64,13,738</Text>
            <Text style={styles.statChange}>26.3% remaining</Text>
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
            <Text style={styles.statChange}>+5.1% improvement</Text>
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
                    <Text style={styles.categoryAmount}>₹{(1800000 * value / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a2b4b',
    textAlign: 'center',
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
    // Active navigation item styling
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
