import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import axios from "axios";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/accounts");
      setAccounts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          await axios.delete(`http://localhost:3000/accounts/${id}`);
          fetchAccounts();
        },
      },
    ]);
  };

  return (
    <View>
      <Text>Danh sách tài khoản</Text>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text>
              {item.email} ({item.role})
            </Text>
            {item.role !== "admin" && (
              <Button title="Xóa" onPress={() => handleDelete(item.id)} />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default AccountManager;
