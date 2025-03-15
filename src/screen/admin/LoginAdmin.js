// import React, { useContext, useState } from "react";
// import { View, Text, TextInput, Button, Alert } from "react-native";
// import { Context } from "../../context/Context";

// export default function AdminLogin({ navigation }) {
//   const { setAccount } = useContext(Context);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     if (username === "admin" && password === "admin123") {
//       setAccount({ username: "admin", role: "admin" });
//       navigation.replace("AdminDashboard"); // Chuyển đến trang admin
//     } else {
//       Alert.alert("Sai thông tin", "Vui lòng nhập đúng tài khoản admin");
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Admin Login</Text>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={{ borderWidth: 1, padding: 10, width: 200, marginBottom: 10 }}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={{ borderWidth: 1, padding: 10, width: 200, marginBottom: 10 }}
//       />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// }
