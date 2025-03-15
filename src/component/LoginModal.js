import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Context } from "../context/Context";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLogin({ navigation }) {
  const { setAccount } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `http://${process.env.IP_LOCAL}:3000/accounts`
        );
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Lỗi khi tải accounts:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu tài khoản.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleLogin = () => {
    if (!accounts) {
      Alert.alert("Lỗi", "Dữ liệu tài khoản chưa tải xong.");
      return;
    }

    const foundUser = accounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (foundUser) {
      setAccount(foundUser);
      if (foundUser.role === "admin") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("BottomNavigator");
      }
    } else {
      Alert.alert("Sai thông tin", "Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6600" />
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </>
      )}
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 280,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
