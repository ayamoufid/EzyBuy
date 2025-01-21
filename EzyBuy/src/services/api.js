import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URLs 
const API_URL_authent = 'http://192.168.0.111:5282/api';
const API_URL_products = 'http://192.168.0.111:5282/api';
const API_URL_cart = 'http://192.168.0.111:5132/api';
const API_URL_order = 'http://192.168.0.111:5132/api';
export const PRODUCTS_BASE_URL = 'http://192.168.0.111:5296';


// Création des instances axios pour chaque service
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Ajout de l'intercepteur pour le token
  instance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

// Création des instances pour chaque service
const authApi = createAxiosInstance(API_URL_authent);
const productsApi = createAxiosInstance(API_URL_products);
const cartApi = createAxiosInstance(API_URL_cart);
const orderApi = createAxiosInstance(API_URL_order);

// Auth Service
export const authService = {
  login: (username, password) => authApi.post('/auth/login', { username, password }),
  register: (userData) => authApi.post('/auth/register', userData),
  logout: () => AsyncStorage.removeItem('token'),
  getUserDetails: async (token) => {
    const response = await authApi.get('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
};

// Products Service
export const productsService = {
  getAllProducts: () => productsApi.get('/products'),
  getProductById: (id) => productsApi.get(`/products/${id}`),
  createProduct: (product) => productsApi.post('/products', product),
  updateProduct: (id, updatedProduct) => productsApi.put(`/products/${id}`, updatedProduct),
  deleteProduct: (id) => productsApi.delete(`/products/${id}`)
};

const getUserId = async () => {
  const userId = await AsyncStorage.getItem('user_id');
  return userId;
};

export const cartService = {
  getCart: async () => {
    const userId = await getUserId();
    return cartApi.get(`/cart/${userId}`);
  },
  addToCart: async (productId, quantity) => {
    const userId = await getUserId();
    await cartApi.post(`/cart/add/${userId}`, { ProductId: productId, Quantity: quantity });
    return cartApi.get(`/cart/${userId}`);  
  },
  updateQuantity: async (productId, quantity) => {
    const userId = await getUserId();
    return cartApi.put(`/cart/update/${userId}`, { ProductId: productId, Quantity: quantity });
  },
  removeFromCart: async (productId) => {
    const userId = await getUserId();
    return cartApi.delete(`/cart/remove/${userId}/${productId}`);
  },
  checkout: async () => {
    const userId = await getUserId();
    return cartApi.post(`/cart/checkout/${userId}`);
  },
};

// Order Service
export const orderService = {
  createOrder: (orderData) => orderApi.post('/orders', orderData),
  getOrders: () => orderApi.get('/orders'),
  getOrderById: (id) => orderApi.get(`/orders/${id}`),
  getOrdersByUserId: async () => {
    const userId = await getUserId();
    return orderApi.get(`/orders/user/${userId}`);
  }
};