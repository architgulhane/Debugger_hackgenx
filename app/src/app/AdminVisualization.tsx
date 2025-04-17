import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminVisualization = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Analytics</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigateTo('SignIn')}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>User Activity</Text>
            <View style={styles.chartControlsContainer}>
              <TouchableOpacity style={styles.chartControl}>
                <Text style={styles.chartControlText}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chartControl, styles.chartControlActive]}>
                <Text style={[styles.chartControlText, styles.chartControlTextActive]}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chartControl}>
                <Text style={styles.chartControlText}>Year</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.chartPlaceholder}>
            <Icon name="bar-chart" size={80} color="#cbd5e1" />
            <Text style={styles.placeholderText}>User Activity Chart</Text>
          </View>
        </View>
        
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Budget Allocation</Text>
            <TouchableOpacity style={styles.refreshButton}>
              <Icon name="refresh" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartPlaceholder}>
            <Icon name="pie-chart" size={80} color="#cbd5e1" />
            <Text style={styles.placeholderText}>Budget Distribution Chart</Text>
          </View>
        </View>
        
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          
          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>New Users</Text>
              <View style={styles.metricValueContainer}>
                <Text style={styles.metricValue}>+12</Text>
                <Text style={styles.metricTrend}>+8%</Text>
              </View>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Active Users</Text>
              <View style={styles.metricValueContainer}>
                <Text style={styles.metricValue}>18</Text>
                <Text style={[styles.metricTrend, styles.metricTrendDown]}>-3%</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Average Budget</Text>
              <View style={styles.metricValueContainer}>
                <Text style={styles.metricValue}>$178</Text>
                <Text style={styles.metricTrend}>+12%</Text>
              </View>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Entries</Text>
              <View style={styles.metricValueContainer}>
                <Text style={styles.metricValue}>152</Text>
                <Text style={styles.metricTrend}>+24%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('AdminHome')}
        >
          <Icon name="dashboard" size={24} color="#666" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]} 
          onPress={() => {}}
        >
          <Icon name="bar-chart" size={24} color="#3b82f6" />
          <Text style={[styles.navText, styles.navTextActive]}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('AdminLedger')}
        >
          <Icon name="book" size={24} color="#666" />
          <Text style={styles.navText}>Entries</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('AdminEntry')}
        >
          <Icon name="settings" size={24} color="#666" />
          <Text style={styles.navText}>Settings</Text>
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
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  chartControlsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartControl: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chartControlActive: {
    backgroundColor: '#3b82f6',
  },
  chartControlText: {
    fontSize: 12,
    color: '#64748b',
  },
  chartControlTextActive: {
    color: '#ffffff',
  },
  refreshButton: {
    padding: 6,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 14,
  },
  metricsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  metricTrend: {
    fontSize: 14,
    color: '#10b981',
    marginLeft: 8,
  },
  metricTrendDown: {
    color: '#ef4444',
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

export default AdminVisualization;