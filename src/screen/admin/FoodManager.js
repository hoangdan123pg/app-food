import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { IP_LOCAL } from "@env";
import { MaterialIcons } from "@expo/vector-icons";

const apiUrl = `http://${IP_LOCAL}:3000/foods`;

const FoodManager = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    name: "",
    image: "",
    category: "",
    description: "",
    price: "",
    rating: "",
    reviews: "",
    available: true,
  });
  const [editingFood, setEditingFood] = useState(null);
  const [showForm, setShowForm] = useState(false); // State để ẩn/hiện form

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setFoods(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách món ăn:", error);
    }
  };

  const deleteFood = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      setFoods(foods.filter((food) => food.id !== id));
      Alert.alert("Xóa thành công", "Món ăn đã được xóa.");
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
    }
  };

  const handleAddOrUpdateFood = async () => {
    if (
      !newFood.name ||
      !newFood.image ||
      !newFood.category ||
      !newFood.description ||
      !newFood.price ||
      !newFood.rating ||
      !newFood.reviews
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin món ăn.");
      return;
    }

    if (editingFood) {
      const updatedFood = {
        ...editingFood,
        ...newFood,
        price: Number(newFood.price),
        rating: Number(newFood.rating),
        reviews: newFood.reviews,
      };
      try {
        await fetch(`${apiUrl}/${editingFood.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFood),
        });
        setFoods(
          foods.map((food) => (food.id === editingFood.id ? updatedFood : food))
        );
        Alert.alert("Cập nhật thành công", "Món ăn đã được cập nhật.");
        setEditingFood(null);
      } catch (error) {
        console.error("Lỗi khi cập nhật món ăn:", error);
      }
    } else {
      const newId =
        foods.length > 0
          ? Math.max(...foods.map((f) => parseInt(f.id))) + 1
          : 1;
      const newFoodItem = {
        ...newFood,
        id: newId.toString(),
        price: Number(newFood.price),
        rating: Number(newFood.rating),
        reviews: newFood.reviews,
      };
      try {
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFoodItem),
        });
        setFoods([...foods, newFoodItem]);
        Alert.alert("Thêm thành công", "Món ăn đã được thêm.");
      } catch (error) {
        console.error("Lỗi khi thêm món ăn:", error);
      }
    }
    setNewFood({
      name: "",
      image: "",
      category: "",
      description: "",
      price: "",
      rating: "",
      reviews: "",
      available: true,
    });
    setShowForm(false); // Ẩn form sau khi thêm/sửa xong
  };

  const startEditingFood = (food) => {
    setEditingFood(food);
    setNewFood(food);
    setShowForm(true); // Hiện form khi sửa món ăn
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodCard}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text>📍 Danh mục: {item.category}</Text>
        <Text>💰 Giá: {item.price.toLocaleString("vi-VN")} VND</Text>
        <Text>
          ⭐ Đánh giá: {item.rating} ({item.reviews} đánh giá)
        </Text>
        <Text>📜 Mô tả: {item.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => startEditingFood(item)}>
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteFood(item.id)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Quản lý món ăn</Text>

      {/* Nút hiển thị/ẩn form */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowForm(!showForm)}
      >
        <MaterialIcons
          name={showForm ? "close" : "add"}
          size={30}
          color="red"
        />
        <Text style={styles.toggleButtonText}>
          {showForm ? "Đóng" : "Thêm"}
        </Text>
      </TouchableOpacity>

      {/* Form nhập món ăn (ẩn/hiện theo showForm) */}
      {showForm && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên món"
            value={newFood.name}
            onChangeText={(text) => setNewFood({ ...newFood, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hình ảnh URL"
            value={newFood.image}
            onChangeText={(text) => setNewFood({ ...newFood, image: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Danh mục"
            value={newFood.category}
            onChangeText={(text) => setNewFood({ ...newFood, category: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Mô tả"
            value={newFood.description}
            onChangeText={(text) =>
              setNewFood({ ...newFood, description: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Giá"
            keyboardType="numeric"
            value={newFood.price}
            onChangeText={(text) => setNewFood({ ...newFood, price: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Đánh giá (rating)"
            keyboardType="numeric"
            value={newFood.rating}
            onChangeText={(text) => setNewFood({ ...newFood, rating: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Lượt đánh giá (reviews)"
            value={newFood.reviews}
            onChangeText={(text) => setNewFood({ ...newFood, reviews: text })}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddOrUpdateFood}
          >
            <MaterialIcons
              name={editingFood ? "save" : "check"}
              size={24}
              color="white"
            />
            <Text style={styles.addButtonText}>
              {editingFood ? "Lưu thay đổi" : "Thêm món ăn"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFoodItem}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  toggleButton: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  foodCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});

export default FoodManager;
