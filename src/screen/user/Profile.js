import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken"); // Xóa token
    navigation.replace("Login"); // Quay lại màn hình đăng nhập
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Trang Cá Nhân</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
}
