import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context } from "../../context/Context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

Text.defaultProps = {
  style: { fontFamily: "Roboto" },
};

const HomeScreen = () => {
  const { foods } = useContext(Context);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.deliveryText}>Deliver to</Text>
          <Text style={styles.locationText}>
            Times Square <Ionicons name="chevron-down" size={18} />
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <MaterialIcons name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput placeholder="Bạn muốn ăn gì ?" style={styles.searchInput} />
      </View>

      {/* Special Offers */}
      <View style={styles.offerContainer}>
        <Image
          source={{
            uri: "https://giadinh.mediacdn.vn/zoom/740_463/2017/wanderlust-tips-nhung-dieu-ve-mon-pho-bo-khong-phai-ai-cung-biet-1-tkeu-1487926021486.jpg",
          }}
          style={styles.offerImage}
        />
      </View>

      {/* Category Icons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {[
          "Hamburger",
          "Pizza",
          "Noodles",
          "Meat",
          "Vegetables",
          "Dessert",
          "Drink",
          "More",
        ].map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <Ionicons name="fast-food" size={28} color="orange" />
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Food List */}
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
          style={styles.foodItem}
          onPress={() => navigation.navigate("FoodDetail", { foodId: item.id })}>
            <Image source={{ uri: item.image }} style={styles.foodImage} />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDetails}>
                {item.distance} km | ⭐ {item.rating} ({item.reviews})
              </Text>
              <Text style={styles.foodPrice}>{item.price} VND</Text>
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
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  deliveryText: {
    fontSize: 14,
    color: "gray",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  offerContainer: {
    backgroundColor: "green",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  offerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 10,
    height:150
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 80, // Đảm bảo có đủ chỗ cho chữ
  },
  foodItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  foodInfo: {
    marginLeft: 20,
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foodDetails: {
    fontSize: 14,
    color: "gray",
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
});

export default HomeScreen;
