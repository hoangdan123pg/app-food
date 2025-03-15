import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { IP_LOCAL } from "@env";

const apiUrl = `http://${IP_LOCAL}:3000/orders`;

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND"; // Hiển thị 500.000 VND
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Mã đơn: {item.orderId}</Text>
      <Text>👤 Người đặt: {item.userId}</Text>
      <Text>📦 Trạng thái: {item.status}</Text>
      <Text>💳 Thanh toán: {item.paymentMethod}</Text>
      <Text>💰 Tổng tiền: {formatPrice(item.totalPrice)}</Text>
      <Text>📍 Địa chỉ: {item.shippingAddress.addressDetails}</Text>
      {item.shippingAddress.note ? (
        <Text>📝 Ghi chú: {item.shippingAddress.note}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Quản lý đơn hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={renderOrderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#007bff",
  },
});

export default OrderManager;
