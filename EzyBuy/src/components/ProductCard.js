import React , { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PRODUCTS_BASE_URL, cartService } from '../services/api';
import QuantitySelector from './QuantitySelector';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async (productId) => {
    try {
      await cartService.addToCart(productId, quantity);
      Alert.alert('Success', 'Product added to cart');   
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'ajout au panier.';
      Alert.alert(
        'Erreur',
        errorMessage,
        [
          { text: 'OK', onPress: () => console.log('Alerte fermée') }
        ]
      );
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Details', { productId: product.id })}
    >
      <Image 
        source={{ uri: `${PRODUCTS_BASE_URL}${product.imageUrl}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toFixed(2)} Dhs</Text>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => handleAddToCart(product.id)}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#F7E9CC',
      borderRadius: 10,
      margin: 3,
      overflow: 'hidden',
      elevation: 3,
      width: 200, 
      height: 400,
    },
    image: {
      height: 250, 
    },
    info: {
      padding: 12,
    },
    name: {
      fontSize: 12.5,
      fontWeight: '600',
      color: '#262626',
    },
    price: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FD7924',
      marginTop: 4,
    },
    addButton: {
      backgroundColor: '#FD7924',
      padding: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FBF6E3',
      fontWeight: '600',
    },
});

export default ProductCard;