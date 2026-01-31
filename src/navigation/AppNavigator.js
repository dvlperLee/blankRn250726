import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Main from '../screens/Main';
import Import from '../screens/Import';
import Export from '../screens/Export';
import Management from '../screens/Management';
import History from '../screens/History';
import ImportMgmt from '../screens/ImportMgmt';
import ExportMgmt from '../screens/ExportMgmt';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Import" component={Import} />
        <Stack.Screen name="Export" component={Export} />
        <Stack.Screen name="Management" component={Management} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="ImportMgmt" component={ImportMgmt} />
        <Stack.Screen name="ExportMgmt" component={ExportMgmt} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;