import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { ContextProvider } from "./src/context/Context";
import BottomNavigator from "./src/navigator/BottomNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { Text } from "react-native";

Text.defaultProps = {
  style: { fontFamily: "Roboto" },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <ContextProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <BottomNavigator />
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaProvider>
  );
};

export default App;