import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminEntry = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [allowNewRegistrations, setAllowNewRegistrations] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigateTo('SignIn')}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>System Settings</Text>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Allow New Registrations</Text>
              <Text style={styles.settingDescription}>Enable or disable new user registrations</Text>
            </View>
            <Switch
              value={allowNewRegistrations}
              onValueChange={setAllowNewRegistrations}
              trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
              thumbColor={allowNewRegistrations ? '#3b82f6' : '#94a3b8'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Maintenance Mode</Text>
              <Text style={styles.settingDescription}>Put the application in maintenance mode</Text>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
              thumbColor={maintenanceMode ? '#3b82f6' : '#94a3b8'}
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>User Preferences</Text>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>Allow push notifications to users</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
              thumbColor={notificationsEnabled ? '#3b82f6' : '#94a3b8'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Anonymous Data Sharing</Text>
              <Text style={styles.settingDescription}>Share anonymous usage data</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
              thumbColor={dataSharing ? '#3b82f6' : '#94a3b8'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Enable dark theme for all users</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
              thumbColor={darkMode ? '#3b82f6' : '#94a3b8'}
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Administrative Actions</Text>
        
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="group" size={20} color="#3b82f6" style={styles.actionIcon} />
            <Text style={styles.actionText}>User Management</Text>
            <Icon name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="backup" size={20} color="#3b82f6" style={styles.actionIcon} />
            <Text style={styles.actionText}>Backup Database</Text>
            <Icon name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="delete-sweep" size={20} color="#3b82f6" style={styles.actionIcon} />
            <Text style={styles.actionText}>Clear Cache</Text>
            <Icon name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerActionButton]}>
            <Icon name="warning" size={20} color="#ef4444" style={styles.actionIcon} />
            <Text style={styles.dangerActionText}>Reset Application</Text>
            <Icon name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>
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
          style={styles.navItem} 
          onPress={() => navigateTo('AdminVisualization')}
        >
          <Icon name="bar-chart" size={24} color="#666" />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigateTo('AdminLedger')}
        >
          <Icon name="book" size={24} color="#666" />
          <Text style={styles.navText}>Entries</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]} 
          onPress={() => {}}
        >
          <Icon name="settings" size={24} color="#3b82f6" />
          <Text style={[styles.navText, styles.navTextActive]}>Settings</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    marginTop: 16,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  dangerActionButton: {
    borderBottomWidth: 0,
  },
  dangerActionText: {
    flex: 1,
    fontSize: 16,
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

export default AdminEntry;