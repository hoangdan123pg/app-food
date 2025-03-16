import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Context } from '../../context/Context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";

const Favorite = () => {
  const { account } = useContext(Context);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const navigation = useNavigation();

  const fetchFavoriteFoods = async () => {
    try {
      //console.log("Fetching favorite foods...");
      const favoriteResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/favorites?userId=${account.id}`);
      const favoriteData = await favoriteResponse.json();
      
      const foodIds = favoriteData[0]?.foodIds || [];
      const favoriteFoodDetails = await Promise.all(
        foodIds.map(async (foodId) => {
          const foodResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/foods/${foodId}`);
          return foodResponse.json();
        })
      );

      setFavoriteFoods(favoriteFoodDetails);
    } catch (error) {
      console.error("Error fetching favorite foods:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteFoods();
    }, [])
  );

  const handleFoodClick = (foodId) => {
    navigation.navigate('FoodDetail', { foodId });
  };

  const removeFromFavorites = async (foodId) => {
    try {
      const favoriteResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/favorites?userId=${account.id}`);
      const favoriteData = await favoriteResponse.json();
      if (!favoriteData.length) return;

      const favoriteId = favoriteData[0].id;
      const updatedFavorites = favoriteData[0].foodIds.filter(id => id !== foodId);

      if (updatedFavorites.length > 0) {
        await fetch(`http://${process.env.IP_LOCAL}:3000/favorites/${favoriteId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foodIds: updatedFavorites })
        });
      } else {
        await fetch(`http://${process.env.IP_LOCAL}:3000/favorites/${favoriteId}`, {
          method: 'DELETE',
        });
      }

      setFavoriteFoods(favoriteFoods.filter(food => food.id !== foodId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Món ăn yêu thích</Text>
        {favoriteFoods.length > 0 ? (
          favoriteFoods.map((item) => (
            <View key={item.id} style={styles.favoriteItem}>
              <TouchableOpacity onPress={() => handleFoodClick(item.id)} style={styles.foodInfo}>
                <Image source={{ uri: item.image }} style={styles.foodImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodPrice}>${item.price}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => removeFromFavorites(item.id)} style={styles.favoriteButton}>
              <Text style={{ fontSize: 24 }}>❤️</Text>
                                  </TouchableOpacity>
              {/* <Button title="Xóa" color="red" text="red" onPress={() => removeFromFavorites(item.id)} /> */}
            </View>
          ))
        ) : (
          <Text style={styles.noFavorites}>Bạn chưa có món ăn yêu thích nào.</Text>
        )}
      </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  favoriteItem: {
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
    elevation: 3,
    justifyContent: 'space-between'
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
  noFavorites: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20
  },
  favoriteButton: {
    padding: 10,
},
});

export default Favorite;
