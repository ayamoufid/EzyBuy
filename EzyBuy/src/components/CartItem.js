import React , { useState, useEffect }  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QuantitySelector from './QuantitySelector';
import {productsService} from '../services/api';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [productNames, setProductNames] = useState({});
  
    useEffect(() => {
      const fetchProductNames = async () => {
        try {
          const response = await productsService.getAllProducts();
          const names = response.data.reduce((acc, product) => {
            acc[product.id] = product.name;
            return acc;
          }, {});
          setProductNames(names);
        } catch (error) {
          console.error('Error fetching product names:', error);
        }
      };
  
      fetchProductNames();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{productNames[item.productId]}</Text>
      <Text style={styles.price}>
        {(item.price * item.quantity).toFixed(2)} Dhs
      </Text>
      <QuantitySelector 
          quantity={item.quantity} 
          setQuantity={(newQuantity) => {
            console.log("Passing new quantity to onUpdateQuantity:", newQuantity);
            onUpdateQuantity(newQuantity);
          }} 
      />
      <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceRemoveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    color: '#FD7924',
  },
  removeButton: {
    backgroundColor: '#FD7924',
    padding: 8,
    borderRadius: 9,
    marginTop: 16,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FBF6E3',
    fontWeight: '600',
  },
});

export default CartItem;