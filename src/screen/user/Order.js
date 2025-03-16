import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Context } from '../../context/Context';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
const OrderScreen = () => {
  const { account } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://${process.env.IP_LOCAL}:3000/orders?userId=${account.id}`);
        const data = await response.json();
        setOrders(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'orange' };
      case 'completed':
        return { color: 'green' };
      case 'canceled':
        return { color: 'red' };
      default:
        return { color: 'black' };
    }
  };

  return (
    <SafeAreaView  style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderItem}
            onPress={() => navigation.navigate('OrderDetail', { order: item })}
          >
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Mã đơn: {item.orderId}</Text>
              <Text style={styles.orderTotal}>Tổng tiền: ${item.totalPrice}</Text>
              <Text>Thanh toán: {item.paymentMethod}</Text>
              <Text>Ngày đặt: {new Date(item.createdAt).toLocaleDateString()}</Text>
              <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>
                Trạng thái: {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderInfo: {
    marginBottom: 5
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green'
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default OrderScreen;
