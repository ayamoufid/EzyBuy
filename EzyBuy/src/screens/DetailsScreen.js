import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { PRODUCTS_BASE_URL, productsService } from '../services/api';
import { StyleSheet, Image, Text } from 'react-native';
import QuantitySelector from '../components/QuantitySelector';
import { cartService } from '../services/api';

const DetailsScreen = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      const response = await productsService.getProductById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  };

  const handleAddToCart = async (productId) => {
      try {
        await cartService.addToCart(productId, quantity);
        Alert.alert('Success', 'Product added to cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to add product to cart'
        );
      }
    };

  return (
    <View style={styles.container}>
      {product && (
        <>
          <Image 
            source={{ uri: `${PRODUCTS_BASE_URL}${product.imageUrl}` }} 
            style={styles.detailImage} 
          />
          <View style={styles.detailsInfo}>
            <Text style={styles.detailTitle}>{product.name}</Text>
            <Text style={styles.detailPrice}>{product.price.toFixed(2)} Dhs</Text>
            <Text style={styles.description}>{product.description}</Text>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddToCart(product.id)}
                  >
                    <Text style={styles.buttonText}>Add to Cart</Text>
                  </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  detailImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  detailsInfo: {
    marginTop: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 20,
    color: '#888',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#FD7924',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
    width: 100,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FBF6E3',
    fontWeight: '600',
  },
});

export default DetailsScreen;