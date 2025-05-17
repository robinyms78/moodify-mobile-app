import DrawerNavigator from './navigator/DrawerNavigator';
import { StatusBar } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import WeatherScreen from './screens/WeatherScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

// Create stack navigator
const Stack = createStackNavigator();

export default function App() 
{
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={LoginScreen} /> 
            <Stack.Screen name="Weather" component={WeatherScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}