import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuantitySelector = ({ quantity, setQuantity }) => {
  const increment = () => {
    const newQuantity1 = quantity + 1;
    console.log("Old+:", quantity);
    console.log("New+:", newQuantity1);
    setQuantity(newQuantity1);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      console.log("Old-:", quantity);
      console.log("New-:", newQuantity);
      setQuantity(newQuantity);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrement} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={increment} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD7924',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FBF6E3',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuantitySelector;