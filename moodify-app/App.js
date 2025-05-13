// App.js
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginForm from './LoginForm';

export default function App() 
{
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LoginForm />
    </SafeAreaView>
  );
}