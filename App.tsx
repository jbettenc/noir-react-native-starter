import {createNativeStackNavigator} from '@react-navigation/native-stack';
import config from './tamagui.config';
import React from 'react';
import {TamaguiProvider} from 'tamagui';
import Home from './pages/home';
import {NavigationContainer} from '@react-navigation/native';
import ProductProof from './pages/product-proof';
import PedersenProof from './pages/pedersen-proof';
import PassportProofSig from './pages/passport-proof-sig';
import PassportProof from './pages/passport-proof';
import Secp256r1Proof from './pages/secp256r1-proof';
import './shim';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ProductProof" component={ProductProof} />
          <Stack.Screen name="PedersenProof" component={PedersenProof} />
          <Stack.Screen name="Secp256r1Proof" component={Secp256r1Proof} />
          <Stack.Screen name="PassportProofSig" component={PassportProofSig} />
          <Stack.Screen name="PassportProof" component={PassportProof} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

export default App;
