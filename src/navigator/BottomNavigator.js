import React, { useContext, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screen/user/HomeScreen';
import Notification from '../screen/user/Notification';
import Order from '../screen/user/Order';
import Profile from '../screen/user/Profile';
import { Context } from '../context/Context';
import LoginModal from '../component/LoginModal';
const Tab = createBottomTabNavigator();
export default function BottomNavigator() {
  const { account } = useContext(Context);
  console.log("account",account)
  const [isLoginVisible, setLoginVisible] = useState(false);
  const navigation = useNavigation();
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === "HomeScreen")
              iconName = focused ? "home" : "home-outline"; // Thay đổi icon khi chọn
            else if (route.name === "Order")
              iconName = focused ? "list" : "list-outline";
            else if (route.name === "Notification")
              iconName = focused ? "notifications" : "notifications-outline";
            else if (route.name === "Profile")
              iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "pink",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Order" component={Order} options={{ headerShown: false }} />
        <Tab.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
        {/* <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} /> */}
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
          listeners={{
            tabPress: (e) => {
              if (account == "null") {
                e.preventDefault();
                setLoginVisible(true); // Mở modal login
              }
            },
          }}
        />
      </Tab.Navigator>
      <LoginModal isVisible={isLoginVisible} onClose={() => setLoginVisible(false)} />
    </>
  );
}