import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import { IP_LOCAL } from "@env";

const apiUrl = `http://${IP_LOCAL}:3000`;

const Chart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersResponse = await axios.get(`${apiUrl}/orders`);
      const orders = ordersResponse.data;

      // Lọc đơn hàng thành công
      const successfulOrders = orders.filter(
        (order) => order.status === "successful"
      );

      // Nhóm doanh thu theo ngày
      const revenueByDate = {};
      successfulOrders.forEach((order) => {
        const date = new Date(order.createdAt).toISOString().split("T")[0];
        if (!revenueByDate[date]) {
          revenueByDate[date] = 0;
        }
        revenueByDate[date] += order.totalPrice;
      });

      // Chuyển đổi thành dạng phù hợp với biểu đồ
      const labels = Object.keys(revenueByDate);
      const data = Object.values(revenueByDate).map((value) => value / 1000); // Chia cho 1.000

      setChartData({
        labels,
        datasets: [{ data }],
      });

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Thống kê doanh thu theo ngày</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={250}
          yAxisLabel="₫"
          yAxisSuffix="K" // Thêm đơn vị nghìn đồng
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#f3f3f3",
            backgroundGradientTo: "#e8e8e8",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 10 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#007bff" },
          }}
          verticalLabelRotation={1}
          fromZero={true}
          showBarTops={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Chart;
