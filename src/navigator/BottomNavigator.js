
import React, { useContext, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screen/user/HomeScreen";
import Notification from "../screen/user/Notification";
import Order from "../screen/user/Order";
import Profile from "../screen/user/Profile";
import AdminDashboard from "../screen/admin/AdminDashboard"; 
import { Context } from "../context/Context";
import LoginModal from "../component/LoginModal";

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {

  const { account } = useContext(Context); // Lấy thông tin tài khoản
  const [isLoginVisible, setLoginVisible] = useState(false);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "HomeScreen")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Order")
            iconName = focused ? "list" : "list-outline";
          else if (route.name === "Notification")
            iconName = focused ? "notifications" : "notifications-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          else if (route.name === "Admin")
            iconName = focused ? "settings" : "settings-outline"; // Icon admin
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "pink",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />

      {/* Kiểm tra nếu là admin thì hiển thị tab Admin */}
      {account?.role === "admin" && (
        <Tab.Screen
          name="Admin"
          component={AdminDashboard}
          options={{ headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
}
