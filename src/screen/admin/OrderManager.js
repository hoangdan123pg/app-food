import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import axios from "axios";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    await axios.patch(`http://localhost:3000/orders/${id}`, {
      status: newStatus,
    });
    fetchOrders();
  };

  return (
    <View>
      <Text>Danh sách đơn hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>Khách hàng: {item.userId}</Text>
            <Text>Món:</Text>
            {item.items.map((food, index) => (
              <Text key={index}>
                - {food.foodId} (x{food.quantity})
              </Text>
            ))}
            <Text>Tổng tiền: {item.totalPrice} VND</Text>
            <Text>Trạng thái: {item.status}</Text>
            <Button
              title="Xác nhận"
              onPress={() => updateStatus(item.orderId, "confirmed")}
            />
            <Button
              title="Hủy"
              onPress={() => updateStatus(item.orderId, "canceled")}
            />
          </View>
        )}
      />
    </View>
  );
};

export default OrderManager;
