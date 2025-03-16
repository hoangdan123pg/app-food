import React, { useContext, useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Context } from '../../context/Context';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';

//import CheckBox from '@react-native-community/checkbox';
const CartScreen = () => {
  const { account } = useContext(Context);
  const [cartCurrent, setCartCurrent] = useState([]);
  const [cartUpdate, setCartUpdate] = useState([]);
  const navigation = useNavigation();
  const [willBuy, setWillBuy] = useState([]);
  const [checked, setChecked] = useState(false);
  //console.log("cart", account)
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart?userId=${account.id}`);
        const cartData = await cartResponse.json();
        setCartUpdate(cartData);
        // Lấy danh sách items trong cart
        const items = cartData[0]?.items || [];

        // Lấy thông tin chi tiết của từng foodId trong cart
        const cartWithFoodDetails = await Promise.all(
          items.map(async (item) => {
            const foodResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/foods/${item.foodId}`);
            const foodData = await foodResponse.json();

            return {
              ...item,
              ...foodData
            };
          })
        );
       // console.log(cartWithFoodDetails)
        setCartCurrent(cartWithFoodDetails);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchCartData();
  }, []);
  const handleFoodClick = (foodId) => {
    navigation.navigate('FoodDetail', { foodId });
  };
  const handleQuantityChange = async (foodId, newQuantity) => {
    const updatedCartToDB = cartCurrent.map(item =>
      item.foodId === foodId ? {foodId: item.foodId, quantity: newQuantity } : { foodId: item.foodId, quantity: item.quantity }
    );
    console.log("payment", updatedCart);
    setCartUpdate(updatedCart);
    const updatedCart = cartCurrent.map(item =>
      item.foodId === foodId ? {...item, quantity: newQuantity } : item
    );
    console.log("payment", updatedCart);
    setCartCurrent(updatedCart);

    // Cập nhật lên database
    const cartResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart?userId=${account.id}`);
    const cartData = await cartResponse.json();

    const cartId = cartData[0].id;

    await fetch(`http://${process.env.IP_LOCAL}:3000/cart/${cartId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: updatedCartToDB })
    });
  };
  const handleCheckboxToggle = (foodId, quantity) => {
    setWillBuy((prev) => {
      const exists = prev.find(item => item.foodId === foodId);
      
      if (exists) {
        return prev.filter(item => item.foodId !== foodId);
      } else {
        return [...prev, { foodId, quantity }];
      }
    });
  };
  const handleRemoveItem = async (foodId) => {
    try {
      const cartResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart?userId=${account.id}`);
      const cartData = await cartResponse.json();
      if (!cartData.length) return;
  
      const cartId = cartData[0].id;
      const updatedItems = cartCurrent.filter(item => item.foodId !== foodId);
  
      // Cập nhật giỏ hàng mới lên server
      await fetch(`http://${process.env.IP_LOCAL}:3000/cart/${cartId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: updatedItems.map(item => ({ foodId: item.foodId, quantity: item.quantity })) })
      });
  
      // Cập nhật state để UI thay đổi ngay lập tức
      setCartCurrent(updatedItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  
  const handleBuy = () => {
    navigation.navigate('Payment', { willBuy });
};
  return (
    <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Giỏ hàng của bạn</Text>
          {cartCurrent.map((item) => (
            <View key={item.foodId} style={styles.cartItem}>
            <Checkbox
              status={willBuy.some(w => w.foodId === item.foodId) ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxToggle(item.foodId, item.quantity)}
            />
            <TouchableOpacity onPress={() => handleFoodClick(item.foodId)} style={styles.foodInfo}>
              <Image source={{ uri: item.image }} style={styles.foodImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>${item.price} x {item.quantity}</Text>
                <View style={styles.quantityControl}>
                  <Button title="-" color="orange" onPress={() => handleQuantityChange(item.foodId, Math.max(1, item.quantity - 1))} />
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Button title="+" color="orange"  onPress={() => handleQuantityChange(item.foodId, item.quantity + 1)} />
                </View>
              </View>
            </TouchableOpacity>
            <Button title="Xóa" color="red" onPress={() => handleRemoveItem(item.foodId)} />
          </View>
          ))}
        </ScrollView>
        <View style={styles.buyButtonContainer}>
          <Button title="Order" onPress={handleBuy} />
        </View>
      </View>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10
  },
  itemInfo: {
    flex: 1
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  foodPrice: {
    fontSize: 16,
    color: '#555'
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16
  },
  buyButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'white'
  }
});
export default CartScreen;  