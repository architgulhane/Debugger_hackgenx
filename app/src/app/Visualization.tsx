import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Visualization = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text className='text-3xl font-bold text-center '>Visualization Page</Text>
      </View>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigateTo('Home')} style={styles.navItem}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('Ledger')} style={styles.navItem}>
          <Icon name="book" size={24} color="#000" />
          <Text style={styles.navText}>Ledger</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('Entry')} style={styles.navItem}>
          <Icon name="edit" size={24} color="#000" />
          <Text style={styles.navText}>Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
  },
});

export default Visualization;
