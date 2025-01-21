import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet,
  TouchableOpacity,
  Text, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { cartService } from '../services/api';
import CartItem from '../components/CartItem';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  const loadCartItems = async () => {
    try {
      const response = await cartService.getCart();
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCartItems();
    }, [])
  );

  const handleUpdateQuantity = (productId, newQuantity) => {
    console.log("Updating quantity for product:", productId, "to:", newQuantity);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from the cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await cartService.removeFromCart(productId);
              setCartItems((prevItems) =>
                prevItems.filter((item) => item.productId !== productId)
              );
            } catch (error) {
              console.error('Error removing item from cart:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCheckout = async () => {
    try {
      await cartService.checkout();
      Alert.alert('Success', 'Checkout completed successfully');
      setCartItems([]);
      navigation.navigate('Orders');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete checkout');
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem 
            key={`${item.productId}-${item.quantity}`}
            item={item}
            onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item.productId, newQuantity)}
            onRemove={() => handleRemoveFromCart(item.productId)}
          />
        )}
        keyExtractor={(item) => item.productId.toString()}
      />

      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total : {calculateTotal(cartItems).toFixed(2)} Dhs</Text>
        </View>
      )}
      <TouchableOpacity 
        style={[
          styles.checkoutButton, 
          { backgroundColor: cartItems.length === 0 ? '#d3d3d3' : '#FD7924' }
        ]}
        onPress={handleCheckout}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E3',
  },
  productList: {
    padding: 8,
  },
  detailImage: {
    width: '100%',
    height: 300,
  },
  detailsInfo: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
  },
  detailPrice: {
    fontSize: 20,
    color: '#FD7924',
    marginTop: 8,
  },
  description: {
    marginTop: 16,
    color: '#262626',
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#d3d3d3',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
  },
  checkoutButton: {
    backgroundColor: '#FD7924',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FBF6E3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
