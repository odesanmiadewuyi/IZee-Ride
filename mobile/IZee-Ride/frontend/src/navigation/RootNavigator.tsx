import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding1 from '../screens/onboarding/Onboarding1';
import Onboarding2 from '../screens/onboarding/Onboarding2';
import Onboarding3 from '../screens/onboarding/Onboarding3';
import LoginBVN from '../screens/auth/LoginBVN';
import LoginBankId from '../screens/auth/LoginBankId';
import SignUpPhoneSE from '../screens/auth/SignUpPhoneSE';
import Home from '../screens/home/Home';
import SelectCause from '../screens/cause/SelectCause';
import CauseDetails from '../screens/cause/CauseDetails';
import ReceiveLeftover from '../screens/leftover/ReceiveLeftover';
import SendLeftover from '../screens/leftover/SendLeftover';
import ScanQr from '../screens/leftover/ScanQr';
import LoadWallet from '../screens/wallet/LoadWallet';
import Withdraw from '../screens/wallet/Withdraw';
import Receipt from '../screens/common/Receipt';
import BookRide from '../screens/ride/BookRide';

export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  LoginBVN: undefined;
  LoginBankId: undefined;
  SignUpPhoneSE: undefined;
  Home: undefined;
  BookRide: undefined;
  SelectCause: undefined;
  CauseDetails: { id?: string };
  ReceiveLeftover: undefined;
  SendLeftover: undefined;
  ScanQr: { for?: 'send' | 'receive' };
  LoadWallet: undefined;
  Withdraw: undefined;
  Receipt: { txId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Onboarding1" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding1" component={Onboarding1} />
      <Stack.Screen name="Onboarding2" component={Onboarding2} />
      <Stack.Screen name="Onboarding3" component={Onboarding3} />
      <Stack.Screen name="LoginBVN" component={LoginBVN} />
      <Stack.Screen name="LoginBankId" component={LoginBankId} />
      <Stack.Screen name="SignUpPhoneSE" component={SignUpPhoneSE} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="BookRide" component={BookRide} />
      <Stack.Screen name="SelectCause" component={SelectCause} />
      <Stack.Screen name="CauseDetails" component={CauseDetails} />
      <Stack.Screen name="ReceiveLeftover" component={ReceiveLeftover} />
      <Stack.Screen name="SendLeftover" component={SendLeftover} />
      <Stack.Screen name="ScanQr" component={ScanQr} />
      <Stack.Screen name="LoadWallet" component={LoadWallet} />
      <Stack.Screen name="Withdraw" component={Withdraw} />
      <Stack.Screen name="Receipt" component={Receipt} />
    </Stack.Navigator>
  );
}
