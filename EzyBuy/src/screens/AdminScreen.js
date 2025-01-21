import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { productsService } from '../services/api';

const AdminScreen = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    quantite: '',
  });

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsService.getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    };
    fetchProducts();
  }, []);

  // Ajouter un produit
  const handleAddProduct = async () => {
    try {
      const response = await productsService.createProduct(newProduct);
      const addedProduct = response.data;
      console.log(addedProduct);
      Alert.alert('Succès', 'Produit ajouté avec succès');
      setModalVisible(false);
      setProducts([...products, addedProduct]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le produit');
    }
  };

  // Modifier un produit
  const handleEditProduct = async () => {
    try {
      const updatedProduct = { ...currentProduct, ...newProduct };
      await productsService.updateProduct(currentProduct.id, updatedProduct);
      Alert.alert('Succès', 'Produit modifié avec succès');
      setModalVisible(false);
      setProducts(products.map((p) => (p.id === currentProduct.id ? updatedProduct : p)));
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
      Alert.alert('Erreur', 'Impossible de modifier le produit');
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (id) => {
    try {
      console.log("id delete" ,id);
      await productsService.deleteProduct(id);
      Alert.alert('Succès', 'Produit supprimé avec succès');
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      Alert.alert('Erreur ', 'Impossible de supprimer le produit');
    }
  };

  // Ouvrir la modal pour ajouter ou modifier
  const openModal = (product = null) => {
    setCurrentProduct(product);
    setNewProduct(
      product || {
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        quantite: '',
      }
    );
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gérer les Produits</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id ? item.id.toString() : item.name}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>Description: {item.description}</Text>
            <Text style={styles.productDetails}>Prix: {item.price.toFixed(2)} Dhs</Text>
            <Text style={styles.productDetails}>Catégorie: {item.category}</Text>
            <Text style={styles.productDetails}>Quantité: {item.quantite}</Text>
            <View style={styles.productActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
                <Text style={styles.buttonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProduct(item.id)}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.buttonText}>Ajouter un Produit</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>{currentProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#A9A9A9"
            value={newProduct.name}
            onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#A9A9A9"
            value={newProduct.description}
            onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Prix"
            placeholderTextColor="#A9A9A9"
            value={newProduct.price ? newProduct.price.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setNewProduct({ ...newProduct, price: parseFloat(text) || '' })}
          />
          <TextInput
            style={styles.input}
            placeholder="Catégorie"
            placeholderTextColor="#A9A9A9"
            value={newProduct.category}
            onChangeText={(text) => setNewProduct({ ...newProduct, category: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="URL de l'image"
            placeholderTextColor="#A9A9A9"
            value={newProduct.imageUrl}
            onChangeText={(text) => setNewProduct({ ...newProduct, imageUrl: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantité"
            placeholderTextColor="#A9A9A9"
            value={newProduct.quantite ? newProduct.quantite.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setNewProduct({ ...newProduct, quantite: parseInt(text, 10) || '' })}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={currentProduct ? handleEditProduct : handleAddProduct}
            >
              <Text style={styles.buttonText}>{currentProduct ? 'Modifier' : 'Ajouter'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FBF6E3', // Fond principal
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#262626', // Texte principal
    },
    productList: {
      paddingBottom: 20,
    },
    productItem: {
      padding: 15,
      backgroundColor: '#F7E9CC', // Fond des éléments de produit
      marginBottom: 10,
      borderRadius: 8,
      shadowColor: '#262626', // Ombre légère
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#262626', // Texte principal sombre
    },
    productDetails: {
      fontSize: 14,
      color: '#262626', // Détails en texte sombre
    },
    productActions: {
      flexDirection: 'row',
      marginTop: 10,
    },
    editButton: {
      flex: 1,
      backgroundColor: '#FD7924', // Bouton d'édition avec accent
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    deleteButton: {
      flex: 1,
      backgroundColor: '#262626', // Bouton de suppression sombre
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginLeft: 10,
    },
    buttonText: {
      color: '#FBF6E3', // Texte clair pour contraste
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: '#FD7924', // Bouton d'ajout avec accent
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    modalContent: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#FBF6E3', // Fond clair dans la modal
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#262626', // Texte principal de la modal
    },
    input: {
      borderWidth: 1,
      borderColor: '#262626', // Bordure sombre
      backgroundColor: '#F7E9CC', // Fond des champs d'entrée
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      color: '#262626', // Texte dans les champs
      placeholderTextColor:'#A9A9A9', // Placeholder en gris clair
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
  });

  
export default AdminScreen;
