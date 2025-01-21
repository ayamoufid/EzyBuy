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


const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        Username: formData.username,
        PasswordHash: formData.password,
        Email: formData.email,
        Role: formData.role,
      });
      Alert.alert('Success', 'Registration successful', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={formData.username}
          onChangeText={(text) =>
            setFormData({ ...formData, username: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) =>
            setFormData({ ...formData, email: text })
          }
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) =>
            setFormData({ ...formData, password: text })
          }
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) =>
            setFormData({ ...formData, confirmPassword: text })
          }
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Register'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>
            Already have an account? Login here
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

export default RegisterScreen;