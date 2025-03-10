import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
export default function LoginModal({ isVisible, onClose }) {
    return (
      <Modal 
        isVisible={isVisible}
        animationIn="slideInUp" // Trượt từ dưới lên
        animationOut="slideOutDown"
        onBackdropPress={onClose} // Đóng khi bấm ra ngoài
        style={styles.modal}
      >
        <View style={styles.container}>
          <ImageBackground 
            //source={require('../assets/login_bg.jpg')} // Đường dẫn ảnh
            style={styles.backgroundImage}
            resizeMode="cover"
          >
          <Text style={styles.title}>Đăng Nhập</Text>
          <Button title="Đóng" onPress={onClose} />
          </ImageBackground>
        </View>
      </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    modal: { 
      justifyContent: 'flex-end',
      margin: 0 
    },
    container: { 
      
      flex:1,
      backgroundColor: 'white', 
      padding: 20, 
      borderTopLeftRadius: 10, 
      borderTopRightRadius: 10 },
    title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }
  });