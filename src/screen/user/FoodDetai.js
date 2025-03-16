import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Context } from "../../context/Context";

const FoodDetail = () => {
    const route = useRoute();
    const { foodId } = route.params;
    const { account } = useContext(Context);
    //console.log("aacoiunt", account.id);
    const [foodDetail, setFoodDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const handleIncrease = () => {
        setQuantity(quantity + 1);
        setTotalPrice((quantity + 1) * foodDetail.price);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setTotalPrice((quantity - 1) * foodDetail.price);
        }
    };
//http://${process.env.IP_LOCAL}:3000/foods/${foodId}
useEffect(() => {
    const fetchFoodDetail = async () => {
        try {
            const foodResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/foods/${foodId}`);
            const foodData = await foodResponse.json();
            setFoodDetail(foodData);
            setTotalPrice(foodData.price);

            // Kiểm tra xem món ăn có trong danh sách yêu thích không
            const favoriteResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/favorites?userId=${account.id}`);
            const favoriteData = await favoriteResponse.json();

            if (favoriteData.length > 0 && favoriteData[0].foodIds.includes(foodId)) {
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    fetchFoodDetail();
}, [foodId]);
    // Xử lý khi nhấn "Add to Cart"
    const handleAddToCart = async () => {
        try {
            // Lấy giỏ hàng hiện tại của user
            const cartResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart?userId=${account.id}`);
            const cartData = await cartResponse.json(); // Chuyển thành JSON
           // console.log("1", cartData);
    
            let updatedCart;
            if (cartData.length > 0) {
                // Nếu user đã có giỏ hàng
                let cart = cartData[0]; // Vì json-server trả về mảng khi query với ?userId=
                let cartId = cart.id;   // Lấy id của giỏ hàng
                let existingItemIndex = cart.items.findIndex(item => item.foodId === foodId);
    
                if (existingItemIndex !== -1) {
                    // Nếu sản phẩm đã có, cập nhật số lượng
                    cart.items[existingItemIndex].quantity += quantity;
                } else {
                    // Nếu sản phẩm chưa có, thêm mới vào items
                    cart.items.push({ foodId, quantity });
                }
                //console.log("2", cart);
    
                // Gửi yêu cầu cập nhật giỏ hàng bằng PATCH với id
                const updateResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart/${cartId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: cart.items }), // Chỉ cập nhật items
                });
    
                updatedCart = await updateResponse.json();
                // console.log("Updated Cart:", updatedCart);
                Alert.alert("Success", "Added to cart!");
            } else {
                // Nếu user chưa có giỏ hàng, tạo mới
                const createResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: `cart${account.userId}`, // Tạo ID duy nhất
                        userId: account.userId,
                        items: [{ foodId, quantity }],
                    }),
                });
    
                updatedCart = await createResponse.json();
                //console.log("New Cart Created:", updatedCart);
            }
    
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };
    const toggleFavorite = async () => {
        try {
            const favoriteResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/favorites?userId=${account.id}`);
            const favoriteData = await favoriteResponse.json();
            let favoriteId, updatedFoodIds;

            if (favoriteData.length > 0) {
                favoriteId = favoriteData[0].id;
                updatedFoodIds = isFavorite
                    ? favoriteData[0].foodIds.filter(id => id !== foodId)
                    : [...favoriteData[0].foodIds, foodId];

                // Cập nhật danh sách yêu thích
                await fetch(`http://${process.env.IP_LOCAL}:3000/favorites/${favoriteId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ foodIds: updatedFoodIds }),
                });
            } else {
                // Nếu user chưa có danh sách yêu thích, tạo mới
                const newFavorite = {
                    userId: account.id,
                    foodIds: [foodId],
                };

                await fetch(`http://${process.env.IP_LOCAL}:3000/favorites`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newFavorite),
                });
            }

            setIsFavorite(!isFavorite);
            Alert.alert("Success", isFavorite ? "Removed from favorites!" : "Added to favorites!");
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };
    
    if (!foodDetail) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: foodDetail.image }} style={styles.foodImage} />
            </View>
            <View style={styles.detailContainer}>
                {/* Bộ đếm số lượng */}
                <View style={styles.controlContainer}>
                    <TouchableOpacity onPress={handleDecrease} style={styles.controlButton}>
                        <Text style={styles.controlText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{quantity.toString()}</Text>
                    <TouchableOpacity onPress={handleIncrease} style={styles.controlButton}>
                        <Text style={styles.controlText}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.foodName}>{foodDetail.name}</Text>
                <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                        <Text style={{ fontSize: 24 }}>{isFavorite ? "❤️" : "🤍"}</Text>
                    </TouchableOpacity>
                <Text style={styles.description}>{foodDetail.description}</Text>
                <Text style={styles.price}>${foodDetail.price} ={">          "}Total: {totalPrice}</Text>
                <Text style={styles.rating}>⭐ {foodDetail.rating} ({foodDetail.reviews} reviews)</Text>

                {/* Nút Add to Cart */}
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 10,
    },
    foodImage: {
        width: "90%",
        height: 250,
        borderRadius: 15,
    },
    detailContainer: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop: -20,
    },
    controlContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "start",
        marginVertical: 20,
    },
    controlButton: {
        backgroundColor: "#FBC02D",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    controlText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    quantity: {
        fontSize: 22,
        fontWeight: "bold",
        marginHorizontal: 15,
        color: "#333",
    },
    foodName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#555",
        lineHeight: 22,
        marginBottom: 15,
    },
    price: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#E63946",
        marginBottom: 15,
    },
    rating: {
        fontSize: 16,
        color: "#FFA500",
        marginBottom: 25,
    },
    addToCartButton: {
        backgroundColor: "#3498db",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    addToCartText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    favoriteContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    favoriteButton: {
        padding: 10,
    },
});

export default FoodDetail;
