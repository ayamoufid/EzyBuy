import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { authService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      const { token } = response.data;
      await AsyncStorage.setItem('token', token); 

      // Get user details using the token
      const userResponse = await authService.getUserDetails(token);
      const { user_id , role } = userResponse.data;
      console.log(user_id, role);
      await AsyncStorage.setItem('user_id', user_id.toString());
      await AsyncStorage.setItem('role', role);
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome to EzyBuy</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>
            Don't have an account? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E3',
  },
  form: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F7E9CC',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FD7924',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FBF6E3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#FD7924',
    fontSize: 16,
  },
});

export default LoginScreen;