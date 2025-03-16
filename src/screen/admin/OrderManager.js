import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { IP_LOCAL } from "@env";

const apiUrl = `http://${IP_LOCAL}:3000/orders`;

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("❌ Lỗi khi tải đơn hàng:", error);
    }
  };

  const toggleOrderStatus = async (orderId) => {
    try {
      const orderToUpdate = orders.find((order) => order.orderId === orderId);
      if (!orderToUpdate) {
        console.error("❌ Không tìm thấy đơn hàng:", orderId);
        return;
      }

      // Chuyển đổi trạng thái đơn hàng
      const newStatus =
        orderToUpdate.status === "successful" ? "pending" : "successful";
      const updatedOrder = { ...orderToUpdate, status: newStatus };

      const response = await fetch(`${apiUrl}/${orderToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Lỗi khi cập nhật:", errorText);
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderToUpdate.id
            ? { ...order, status: newStatus }
            : order
        )
      );

      console.log(`✅ Đơn hàng ${orderId} đã chuyển thành ${newStatus}`);
    } catch (error) {
      console.error("❌ Lỗi khi gửi yêu cầu cập nhật:", error);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
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

      <TouchableOpacity
        style={[
          styles.statusButton,
          {
            backgroundColor:
              item.status === "successful" ? "#dc3545" : "#28a745",
          },
        ]}
        onPress={() => toggleOrderStatus(item.orderId)}
      >
        <Text style={styles.buttonText}>
          {item.status === "successful" ? "Hoàn tác" : "Hoàn thành đơn"}
        </Text>
      </TouchableOpacity>
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
  statusButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OrderManager;
