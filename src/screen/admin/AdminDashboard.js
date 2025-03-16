import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { IP_LOCAL } from "@env";
import Chart from "./Chart";


const apiUrl = `http://${IP_LOCAL}:3000`;

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    availableFoods: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Gọi API lấy dữ liệu
      const ordersResponse = await axios.get(`${apiUrl}/orders`);
      const foodsResponse = await axios.get(`${apiUrl}/foods`);

      const orders = ordersResponse.data;
      const foods = foodsResponse.data;

      // Tính tổng số đơn hàng
      const totalOrders = orders.length;

      // Tính tổng doanh thu (chỉ tính đơn hàng đã thanh toán)
      const totalRevenue = orders
        .filter((order) => order.status === "successful")
        .reduce((sum, order) => sum + order.totalPrice, 0);

      // Đếm số đơn hàng đang chờ xử lý
      const pendingOrders = orders.filter(
        (order) => order.status === "pending"
      ).length;

      // Đếm số món ăn còn hàng
      const availableFoods = foods.filter((food) => food.available).length;

      setStats({ totalOrders, totalRevenue, pendingOrders, availableFoods });
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statText}>📦 Tổng số đơn hàng</Text>
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statText}>💰 Tổng doanh thu</Text>
              <Text style={styles.statValue}>
                {stats.totalRevenue.toLocaleString("vi-VN")} VND
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statText}>⏳ Đơn hàng chờ xử lý</Text>
              <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statText}>🍽️ Món ăn còn hàng</Text>
              <Text style={styles.statValue}>{stats.availableFoods}</Text>
            </View>
          </View>
          <View>
            <Chart></Chart>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Quản lý Món ăn"
            onPress={() => navigation.navigate("FoodManager")}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Quản lý tài khoản"
            onPress={() => navigation.navigate("AccountManager")}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Quản lý đơn hàng"
            onPress={() => navigation.navigate("OrderManager")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 buttonContainer: {
  flexDirection: "row", 
  justifyContent: "space-between", 
  alignItems: "center",
  paddingHorizontal: 20,
  marginTop: 20,
},

buttonWrapper: {
  flex: 1, // Chia đều không gian cho mỗi nút
  marginHorizontal: 5, // Thêm khoảng cách giữa các nút
}
,

  statsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Hiệu ứng bóng trên Android
  },
  statText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default AdminDashboard;
