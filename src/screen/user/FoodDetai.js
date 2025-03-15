import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Context } from "../../context/Context";

const FoodDetail = () => {
    const route = useRoute();
    const { foodId } = route.params;
    const { account } = useContext(Context);
    console.log("aacoiunt", account.id);
    const [foodDetail, setFoodDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
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

    useEffect(() => {
        const apiUrl = `http://${process.env.IP_LOCAL}:3000/foods/${foodId}`;
        // console.log(apiUrl);
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setFoodDetail(data);
                setTotalPrice(data.price);
                // console.log(data);
            })
            .catch((error) => console.error("Fetch error:", error));
    }, [foodId]);



    // Xử lý khi nhấn "Add to Cart"
    const handleAddToCart = async () => {
        try {
            // Lấy giỏ hàng hiện tại của user
            const cartResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart?userId=${account.id}`);
            //console.log("Response Status:", cartResponse.status);

            const rawText = await cartResponse.text(); // Lấy dữ liệu raw
            // console.log("Raw Response:", rawText);
            let cartData;
            try {
                cartData = JSON.parse(rawText); // Chuyển thành JSON
            } catch (err) {
                console.error("JSON Parse Error:", err);
                return; // Thoát sớm nếu JSON lỗi
            }
            //console.log("cartData:", cartData);
            let updatedCart;
            if (cartData.length > 0) {
                // Nếu user đã có giỏ hàng
                let cart = cartData[0]; // Vì `json-server` trả về mảng khi query với `?userId=`
                let existingItemIndex = cart.items.findIndex(item => item.foodId === foodId);
                if (existingItemIndex !== -1) {
                    // Nếu sản phẩm đã có, cập nhật số lượng
                    cart.items[existingItemIndex].quantity += quantity;
                } else {
                    // Nếu sản phẩm chưa có, thêm mới vào `items`
                    cart.items.push({ foodId, quantity });
                }
                // Gửi yêu cầu cập nhật giỏ hàng
                const updateResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart/${cart.id}`, {
                    method: "PUT", // Hoặc PATCH
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cart),
                });
                updatedCart = await updateResponse.json();
                //console.log("Updated Cart:", updatedCart);
                Alert.alert("Success", "Added to cart!");
            } else {
                // Nếu user chưa có giỏ hàng, tạo mới
                const createResponse = await fetch(`http://${process.env.IP_LOCAL}:3000/cart`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: account.userId,
                        items: [{ foodId, quantity }],
                    }),
                });
                updatedCart = await createResponse.json();
            }
            console.log("Updated Cart:", updatedCart);
        } catch (error) {
            console.error("Error updating cart:", error);
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
});

export default FoodDetail;
