import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { productsService } from '../services/api';
import ProductCard from '../components/ProductCard';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FD7924" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E3',
  },
  productList: {
    padding: 0,
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

export default HomeScreen;








/*
import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { productsService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  
  // Animation state for expanding/collapsing the filters
  const [categoryFilterVisible, setCategoryFilterVisible] = useState(false);
  const [priceFilterVisible, setPriceFilterVisible] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [categoryFilter, priceFilter]);

  const loadProducts = async () => {
    try {
      const response = await productsService.getAllProducts();
      let filteredProducts = response.data;

      // Appliquer le filtre par catégorie
      if (categoryFilter !== 'All') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
      }

      // Appliquer le filtre par prix
      if (priceFilter !== 'All') {
        filteredProducts = filteredProducts.filter(product => {
          if (priceFilter === 'Low') {
            return product.price < 1000;
          } else if (priceFilter === 'High') {
            return product.price >= 1000;
          }
          return true;
        });
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FD7924" />;
  }

  return (
    <View style={styles.container}>

      <View style={styles.filters}>

        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setCategoryFilterVisible(!categoryFilterVisible)}
        >
          <Text style={styles.filterButtonText}>Category</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.filterContent, { height: categoryFilterVisible ? 150 : 0 }]}>
          <Picker
            selectedValue={categoryFilter}
            onValueChange={(itemValue) => setCategoryFilter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="All" style={styles.pickerItem} />
            <Picker.Item label="Electronics" value="Electronics" style={styles.pickerItem} />
            <Picker.Item label="Clothing" value="Clothing" style={styles.pickerItem} />
          </Picker>
        </Animated.View>

        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setPriceFilterVisible(!priceFilterVisible)}
        >
          <Text style={styles.filterButtonText}>Price</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.filterContent, { height: priceFilterVisible ? 150 : 0 }]}>
          <Picker
            selectedValue={priceFilter}
            onValueChange={(itemValue) => setPriceFilter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="All" style={styles.pickerItem} />
            <Picker.Item label="Low (< 1000)" value="Low" style={styles.pickerItem} />
            <Picker.Item label="High (>= 1000)" value="High" style={styles.pickerItem} />
          </Picker>
        </Animated.View>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E3',
    paddingTop: 20, // Espacement en haut pour les filtres
  },
  filters: {
    padding: 16,
    backgroundColor: '#F7E9CC',  // Fond coloré pour les filtres
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,  // Espacement entre les filtres et les produits
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#FD7924',
    borderRadius: 8,
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#FBF6E3',
    fontWeight: 'bold',
  },
  filterContent: {
    overflow: 'hidden',
    backgroundColor: '#FBF6E3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FD7924',
    marginBottom: 10,
  },
  picker: {
    height: 10,
    width: '100%',
    backgroundColor: '#FBF6E3', // Fond clair pour les filtres
    borderRadius: 8, // Coins arrondis
  },
  pickerItem: {
    color: '#FD7924', // Couleur du texte des éléments du picker
    fontSize: 16, // Taille du texte
    fontWeight: 'bold', // Gras pour les éléments du picker
  },
  productList: {
    padding: 0,
  },
});

export default HomeScreen;

*/