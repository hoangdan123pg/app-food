import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigator from "./src/navigator/BottomNavigator";
import AdminDashboard from "./src/screen/admin/AdminDashboard";
import AccountManager from "./src/screen/admin/AccountManager"; // Thêm màn hình quản lý tài khoản
import OrderManager from "./src/screen/admin/OrderManager"; // Thêm màn hình quản lý đơn hàng
import LoginModal from "./src/component/LoginModal";
import { ContextProvider } from "./src/context/Context"; // Import ContextProvider

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          if (user.role === "admin") {
            setInitialRoute("AdminDashboard"); // Chuyển đến Admin nếu là admin
          } else {
            setInitialRoute("BottomNavigator"); // Chuyển đến Home nếu là user
          }
        } else {
          setInitialRoute("Login"); // Nếu chưa đăng nhập, vào trang Login
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra đăng nhập:", error);
        setInitialRoute("Login");
      }
    };
    checkLoginStatus();
  }, []);

  if (initialRoute === null) return null; // Chờ kiểm tra login xong mới render

  return (
    <ContextProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              name="Login"
              component={LoginModal}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BottomNavigator"
              component={BottomNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboard}
              options={{ title: "Admin DashBoard" }}
            />
            <Stack.Screen
              name="AccountManager"
              component={AccountManager}
              options={{ title: "Quản lý tài khoản" }}
            />
            <Stack.Screen
              name="OrderManager"
              component={OrderManager}
              options={{ title: "Quản lý đơn hàng" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ContextProvider>
  );
}
