import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { IP_LOCAL } from "@env";
export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(`http://${IP_LOCAL}:3000/accounts`);
      const accounts = await response.json();

      // Kiểm tra email đã tồn tại chưa
      const isExist = accounts.some((acc) => acc.email === email);
      if (isExist) {
        Alert.alert("Lỗi", "Email đã tồn tại!");
        return;
      }

      // Tạo tài khoản mới
      const newUser = {
        id: `ac${accounts.length + 1}`,
        email,
        password,
        role: "user", // Mặc định đăng ký là user
      };

      // Gửi request POST để lưu tài khoản
      await fetch(`http://${IP_LOCAL}:3000/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      Alert.alert("Thành công", "Đăng ký thành công!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      Alert.alert("Lỗi", "Không thể đăng ký, thử lại sau!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: 280,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  registerText: { color: "white", fontSize: 18, fontWeight: "bold" },
  loginLink: { marginTop: 15, color: "#E67E22", fontSize: 16 },
});
