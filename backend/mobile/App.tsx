import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PaymentTabs from './src/screens/PaymentTabs';
import CommunityScreen from './src/screens/CommunityScreen';
import MechanicSignup from './src/screens/MechanicSignup';
import VendorSignup from './src/screens/VendorSignup';
import VendorOrders from './src/screens/VendorOrders';
import Login from './src/screens/Login';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function Placeholder({ label }: { label: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl text-primary">{label}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Delivery" children={() => <Placeholder label="Delivery Ride" />} />
        <Tab.Screen name="Payment" component={PaymentTabs} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Mechanic" component={MechanicSignup} />
        <Tab.Screen name="Vendor" component={VendorSignup} />
        <Tab.Screen name="Orders" component={VendorOrders} />
        <Tab.Screen name="Home" children={() => <Placeholder label="Home" />} />
        <Tab.Screen name="Menu" children={() => <Placeholder label="Menu" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
