import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';
import Appliance from '../interfaces/appliance';
import { useFocusEffect } from 'expo-router';

export default function TabOneScreen() {
  const [appliances, setAppliances] = useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const applianceCollection = collection(db, 'appliances');

  useFocusEffect(
    useCallback(() => {
      fetchAppliances();
    }, [])
);

  const fetchAppliances = async () => {

   const snapshot = await getDocs(collection(db, "appliances"));

  const data = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  setAppliances(data as Appliance[]);
  };

  useEffect(() => {
    console.log(appliances);
  }, [appliances])

  return (
  <View style={styles.main}>
    <View style={styles.container}>
      <Text style={styles.title}>Catalogus</Text>

      <FlatList
        data={appliances}
        renderItem={({ item }) => (
          <View style={styles.applianceContainer}>
            {item.url &&
              <Image
                source={{ uri: item.url }}
                style={styles.image}
              />
            }
            <Text style={styles.description}>
              {item.description}
            </Text>

            <Text style={styles.text}>
              Categorie: {item.category}
            </Text>

            <Text style={styles.text}>
              Prijs: €{item.price.toFixed(2)}/dag
            </Text>

            <Text
              style={[
                styles.availability,
                item.available
                  ? styles.available
                  : styles.unavailable,
              ]}
            >
              {item.available ? 'Beschikbaar' : 'Niet beschikbaar'}
            </Text>

            <Text style={styles.text}>
              Eigenaar: {item.ownerName}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  </View>
);
}

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  applianceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },

  description: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },

  availability: {
    fontWeight: 'bold',
    marginTop: 8,
  },

  available: {
    color: 'green',
  },

  unavailable: {
    color: 'red',
  },
});