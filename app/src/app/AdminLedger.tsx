import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Sample data for the ledger entries
const SAMPLE_ENTRIES = [
  { id: '1', user: 'user1@example.com', type: 'expense', category: 'Housing', amount: -1200, date: '2025-04-10' },
  { id: '2', user: 'user2@example.com', type: 'income', category: 'Salary', amount: 3500, date: '2025-04-08' },
  { id: '3', user: 'user3@example.com', type: 'expense', category: 'Food', amount: -150, date: '2025-04-12' },
  { id: '4', user: 'user4@example.com', type: 'expense', category: 'Transport', amount: -200, date: '2025-04-14' },
  { id: '5', user: 'user1@example.com', type: 'income', category: 'Freelance', amount: 750, date: '2025-04-15' },
  { id: '6', user: 'user5@example.com', type: 'expense', category: 'Entertainment', amount: -85, date: '2025-04-11' },
  { id: '7', user: 'user2@example.com', type: 'expense', category: 'Utilities', amount: -120, date: '2025-04-09' },
  { id: '8', user: 'user3@example.com', type: 'expense', category: 'Healthcare', amount: -240, date: '2025-04-13' },
];

const AdminLedger = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredEntries = SAMPLE_ENTRIES.filter(entry => {
    const matchesSearch = entry.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && entry.type === filterType;
  });

  const renderEntry = ({ item }: { item: typeof SAMPLE_ENTRIES[0] }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.userName}>{item.user}</Text>
        <Text style={styles.entryDate}>{item.date}</Text>
      </View>
      
      <View style={styles.entryDetails}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>{item.category}</Text>
          <View style={[styles.entryType, { backgroundColor: item.type === 'income' ? '#dcfce7' : '#fee2e2' }]}>
            <Text style={[styles.entryTypeText, { color: item.type === 'income' ? '#16a34a' : '#dc2626' }]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.entryAmount, { color: item.type === 'income' ? '#16a34a' : '#dc2626' }]}>
          {item.type === 'income' ? '+' : ''}{item.amount}
        </Text>
      </View>
      
      <View style={styles.entryActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="edit" size={18} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="delete" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Entries</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigateTo('SignIn')}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
            <TouchableOpacity 
              style={styles.searchInput}
              onPress={() => {}}
            >
              <Text style={{ color: searchQuery ? '#1e293b' : '#94a3b8' }}>
                {searchQuery || 'Search by user or category...'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'income' && styles.filterButtonActive]}
              onPress={() => setFilterType('income')}
            >
              <Text style={[styles.filterText, filterType === 'income' && styles.filterTextActive]}>Income</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'expense' && styles.filterButtonActive]}
              onPress={() => setFilterType('expense')}
            >
              <Text style={[styles.filterText, filterType === 'expense' && styles.filterTextActive]}>Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.entriesList}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('AdminHome')}
        >
          <Icon name="dashboard" size={24} color="#666" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('AdminVisualization')}
        >
          <Icon name="bar-chart" size={24} color="#666" />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]} 
          onPress={() => {}}
        >
          <Icon name="book" size={24} color="#3b82f6" />
          <Text style={[styles.navText, styles.navTextActive]}>Entries</Text>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '500',
  },
  entriesList: {
    paddingBottom: 16,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  entryDate: {
    fontSize: 12,
    color: '#64748b',
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 8,
  },
  entryType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  entryTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  entryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginLeft: 12,
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
    // Active state styling
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

export default AdminLedger;