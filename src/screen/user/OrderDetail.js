import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, Button } from "react-native";

const OrderDetail = ({ route, navigation }) => {
  const { order } = route.params;
  const [foodDetails, setFoodDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`http://${process.env.IP_LOCAL}:3000/foods`);
        const data = await response.json();

        // Ghép thông tin món ăn với đơn hàng
        const mergedFoods = order.items.map((item) => {
          const food = data.find((f) => f.id === item.foodId);
          return { ...item, name: food?.name, image: food?.image, price: food?.price };
        });

        setFoodDetails(mergedFoods);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải dữ liệu món ăn!");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [order]);

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`http://${process.env.IP_LOCAL}:3000/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "canceled" }),
      });

      if (response.ok) {
        Alert.alert("Thành công", "Đơn hàng đã được hủy!");
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", "Hủy đơn hàng thất bại!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server!");
    }
  };

  if (loading) return <Text style={styles.loading}>Đang tải...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Chi tiết đơn hàng</Text>

      <ScrollView style={styles.detailContainer}>
        <Text style={styles.orderId}>Mã đơn: {order.orderId}</Text>
        <Text style={styles.date}>Ngày đặt: {new Date(order.createdAt).toLocaleString()}</Text>

        <Text style={styles.sectionTitle}>🍽 Món ăn</Text>
        {foodDetails.map((item, index) => (
          <View key={index} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.foodImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>${order.totalPrice.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>
        <Text style={styles.payment}>{order.paymentMethod == "cash" ? "Tiền mặt" : "Thẻ tín dụng"}</Text>

        <Text style={styles.sectionTitle}>📍 Địa chỉ giao hàng</Text>
        <Text>📞 {order.shippingAddress.phone}</Text>
        <Text>🏠 {order.shippingAddress.addressDetails}</Text>
        <Text>📝 {order.shippingAddress.note}</Text>

        <Text style={styles.sectionTitle}>🔖 Trạng thái</Text>
        <Text style={[styles.status, styles[order.status]]}>{order.status}</Text>

        {/* {order.status === "pending" && (
          <Button title="❌ Hủy đơn hàng" color="red" onPress={handleCancelOrder} />
        )} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  loading: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  detailContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#555",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6f00",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6f00",
  },
  payment: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
    marginTop: 5,
  },
  pending: {
    backgroundColor: "#ffcc00",
    color: "#333",
  },
  completed: {
    backgroundColor: "#4caf50",
    color: "#fff",
  },
  canceled: {
    backgroundColor: "#f44336",
    color: "#fff",
  },
});

export default OrderDetail;
