import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { ContextProvider } from "./src/context/Context";
import BottomNavigator from "./src/navigator/BottomNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
Text.defaultProps = {
  style: { fontFamily: "Roboto"},
};
export default function App() {
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
}
