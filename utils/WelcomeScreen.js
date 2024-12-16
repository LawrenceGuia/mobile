// WelcomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const WelcomeScreen = ({ route, navigation }) => {
  const { username } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome, {username}!</Text>
      <Button title="Log Out" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default WelcomeScreen;