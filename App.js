// App.js
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginForm from './screens/LoginForm';
import WeatherScreen from './screens/WeatherScreen';

export default function App() 
{
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {/* <LoginForm /> */}
      <WeatherScreen />
    </SafeAreaView>
  );
}