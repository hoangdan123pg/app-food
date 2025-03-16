import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Button, Alert } from "react-native";
import { Context } from "../../context/Context";


const Payment = ({ route, navigation }) => {
  const { willBuy } = route.params;
  const { account } = useContext(Context);
  console.log("willBuy", willBuy);
  const [foodDetails, setFoodDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
        "phone": "",
        "addressDetails": "",
        "note": ""
      });
  // Gọi API lấy danh sách món ăn
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`http://${process.env.IP_LOCAL}:3000/foods`);
        const data = await response.json();

        // Ghép dữ liệu món ăn với willBuy
        const mergedFoods = willBuy.map((item) => {
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
  }, [willBuy]);

  // Tính tổng tiền
  const totalAmount = foodDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Gửi đơn hàng
  const handleSubmitOrder = async () => {
    const orderData = {
      orderId: `ord${Date.now()}`,
      userId: account.id,
      items: willBuy,
      totalPrice: totalAmount,
      status: "pending",
      paymentMethod: "cash", // Mặc định thanh toán khi nhận hàng
      shippingAddress: {
        phone: form.phone,
        addressDetails: form.addressDetails,
        note: form.note,
      },
      createdAt: new Date().toISOString(),
    };
    console.log("order", orderData);
    try {
      const response = await fetch(`http://${process.env.IP_LOCAL}:3000/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        Alert.alert("Thành công", "Đơn hàng của bạn đã được gửi!");
        setForm({ phone: "", addressDetails: "", note: "" });
        navigation.navigate("BottomNavigator", { screen: "HomeScreen" });
      } else {
        Alert.alert("Lỗi", "Gửi đơn hàng thất bại!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server!");
    }
  };

  if (loading) return <Text style={styles.loading}>Đang tải...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 HÓA ĐƠN</Text>

      <ScrollView style={styles.invoiceContainer}>
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
      </ScrollView>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng cộng:</Text>
        <Text style={styles.totalPrice}>${totalAmount.toFixed(2)}</Text>
      </View>
        <Text style={styles.totalText}>Hình thức: Thanh toán khi nhận hàng</Text>

            {/* <Text style={styles.label}>📝 Ghi chú:</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Nhập ghi chú tại đây..."
            /> */}
            <Text style={styles.label}>📝 Ghi chú:</Text>
            <TextInput
              style={styles.input}
              value={form.note}
              onChangeText={(prep) => setForm({...form, note: prep})} 
              placeholder="Nhập ghi chú tại đây..."
            />
            <Text style={styles.label}>📍 Địa chỉ giao hàng:</Text>
            <TextInput
              style={styles.input}
              value={form.addressDetails}
              onChangeText={(prep) => setForm({...form, addressDetails: prep})} 
              placeholder="Nhập địa chỉ tại đây..."
            />
            <Text style={styles.label}>📞 Số điện thoại:</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(prep) => setForm({...form, phone: prep})} 
              placeholder="Nhập số điện thoại tại đây..."
            />
            {/* <View style={styles.address}>
        <Text>📞 {account.shippingAddress.phone}</Text>
        <Text>📍 {account.shippingAddress.addressDetails}</Text>
      </View> */}


      <Button title="🛒 Xác nhận đặt hàng" color="#ff6f00" onPress={handleSubmitOrder} />
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  loading: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  invoiceContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
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
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  address: {
    fontSize: 16,
    color: "#555",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
});

export default Payment;
