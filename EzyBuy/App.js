import React , {useState , useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem('role');
      console.log('Role:', role);
      if (role === 'admin') {
        setIsAdmin(true);
      }
    };
    fetchRole();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Orders':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Admin':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FD7924',
        tabBarInactiveTintColor: '#262626',
        tabBarStyle: {
          backgroundColor: '#FBF6E3',
        },
        headerStyle: {
          backgroundColor: '#262626',
        },
        headerTintColor: '#FBF6E3',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminScreen} />}
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#262626',
          },
          headerTintColor: '#FBF6E3',
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({
            title: route.params?.title || 'Product Details',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;