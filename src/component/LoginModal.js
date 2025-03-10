import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
          <Text style={styles.title}>Đăng Nhập</Text>
          <Button title="Đóng" onPress={onClose} />
        </View>
      </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    modal: { justifyContent: 'flex-end', margin: 0 },
    container: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }
  });