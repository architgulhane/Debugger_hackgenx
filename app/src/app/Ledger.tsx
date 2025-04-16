import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';

const Ledger = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={styles.backButton}>
        <Button title="Back to Home" onPress={() => navigateTo('Home')} />
      </View>
      <Text>Ledger Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});

export default Ledger;
