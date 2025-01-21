import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import { orderService, productsService ,authService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const OrderCard = ({ order }) => {
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
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{order.id}</Text>
        <Text style={styles.orderDate}>
          {new Date(order.orderDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.orderItems}>
        {order.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName}>{productNames[item.productId]}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>{item.price.toFixed(2)}Dhs</Text>
          </View>
        ))}
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderStatus}>Status: {order.status}</Text>
        <Text style={styles.orderTotal}>
          Total: {order.totalAmount.toFixed(2)}Dhs
        </Text>
      </View>
    </View>
  );
};

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const loadOrders = async () => {
    try {
      const userId = await getUserId();
      const response = await orderService.getOrdersByUserId(userId);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
      await authService.logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FD7924" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bouton Logout */}
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} color="#FD7924" />
      </View>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E3',
  },
  logoutContainer: {
    margin: 10,
    alignItems: 'flex-end',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: '#F7E9CC',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  orderDate: {
    color: '#666',
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  itemName: {
    flex: 2,
    color: '#262626',
  },
  itemQuantity: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#FD7924',
  },
  orderFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderStatus: {
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FD7924',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});

export default OrdersScreen;
