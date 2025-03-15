import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { IP_LOCAL } from "@env";

const API_URL = `http://${IP_LOCAL}:3000/accounts`;

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(API_URL);
      setAccounts(res.data);
      console.log(accounts);
    } catch (error) {
      console.error("Lỗi khi tải accounts:", error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            fetchAccounts();
          } catch (error) {
            console.error("Lỗi khi xóa account:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Tài Khoản</Text>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.email}>{item.email}</Text>
              <Text
                style={[
                  styles.role,
                  { color: item.role === "admin" ? "red" : "lightblue" },
                ]}
              >
                {item.role}
              </Text>
            </View>
            {item.role !== "admin" && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  email: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  role: {
    fontSize: 14,
    color: "#888",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AccountManager;
