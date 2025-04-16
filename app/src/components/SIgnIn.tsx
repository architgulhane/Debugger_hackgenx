import { View, Text, Button } from 'react-native';
import React from 'react';

const SIgnIn = ({ navigateTo }: { navigateTo: (screen: string) => void }) => {
  return (
    <View>
      <Text>SignIn</Text>
      <Button title="Go to Home" onPress={() => navigateTo('Home')} />
    </View>
  );
};

export default SIgnIn;