import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "../redux/CartReducer";

const MenuItem = ({ item }) => {
  const [additems, setAddItems] = useState(0);
  const [selected, setSelected] = useState(false);
  const dispatch = useDispatch();

  return (
    <View style={styles.menuItemContainer}>
      <Pressable style={styles.pressableContainer}>
        {/* Text Information */}
        <View style={styles.textContainer}>
          <Text style={styles.foodName}>{item?.name}</Text>
          <Text style={styles.foodPrice}>₹{item?.price}</Text>
          
          {/* Rating Stars */}
          <Text style={styles.ratingContainer}>
            {[0, 0, 0, 0, 0].map((_, i) => (
              <FontAwesome
                key={i}
                style={styles.starIcon}
                name={i < Math.floor(item.rating) ? "star" : "star-o"}
                size={15}
                color="#FFD700"
              />
            ))}
          </Text>

          {/* Description */}
          <Text style={styles.foodDescription}>
            {item?.description.length > 40
              ? item?.description.substr(0, 37) + "..."
              : item?.description}
          </Text>
        </View>

        {/* Image and Cart functionality */}
        <Pressable style={styles.imageContainer}>
          <Image style={styles.foodImage} source={{ uri: item?.image }} />

          {/* Cart actions when item is selected */}
          {selected ? (
            <Pressable style={styles.cartActions}>
              <Pressable
                onPress={() => {
                  if (additems === 1) {
                    dispatch(removeFromCart(item));
                    setAddItems(0);
                    setSelected(false);
                    return;
                  }
                  setAddItems((c) => c - 1);
                  dispatch(decrementQuantity(item));
                }}
              >
                <Text style={styles.decrementButton}>-</Text>
              </Pressable>

              <Pressable>
                <Text style={styles.itemQuantity}>{additems}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setAddItems((c) => c + 1);
                  dispatch(incrementQuantity(item));
                }}
              >
                <Text style={styles.incrementButton}>+</Text>
              </Pressable>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setSelected(true);
                if (additems === 0) {
                  setAddItems((c) => c + 1);
                }
                dispatch(addToCart(item));
              }}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  pressableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    width: 220,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
  },
  foodPrice: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "500",
  },
  ratingContainer: {
    marginTop: 5,
    borderRadius: 4,
  },
  starIcon: {
    paddingHorizontal: 3,
  },
  foodDescription: {
    marginTop: 8,
    color: "gray",
    fontSize: 16,
    width: 200,
  },
  imageContainer: {
    position: "relative",
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  cartActions: {
    position: "absolute",
    top: 95,
    left: 20,
    backgroundColor: "#fd5c63",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  decrementButton: {
    fontSize: 25,
    color: "white",
    paddingHorizontal: 6,
  },
  itemQuantity: {
    color: "white",
    paddingHorizontal: 6,
    fontSize: 15,
  },
  incrementButton: {
    fontSize: 17,
    color: "white",
    paddingHorizontal: 6,
  },
  addButton: {
    position: "absolute",
    top: 95,
    left: 20,
    borderColor: "#E32636",
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fd5c63",
  },
});

export default MenuItem;
