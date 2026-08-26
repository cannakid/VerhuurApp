import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Image, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';
import Appliance from '../interfaces/appliance';
import { navigate } from 'expo-router/build/global-state/routing';
import SelectDropdown from "react-native-select-dropdown";
import Categories from '../interfaces/Categories';
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";



export default function TabTwoScreen() {
    const defaultAppliance = {id: "",
    userId : getAuth().currentUser?.uid ?? "", // current user should never be null while someone can access this
    ownerName: "",
    description: "",
    category: "",
    url: "",
    price: 0,
    available: true};
  
  const auth = getAuth();
  const user = auth.currentUser;
  const [appliance, setAppliance] = useState<Appliance>(defaultAppliance);
  const applianceCollection = collection(db, 'appliances');
  
  const [imageUri, setImageUri] = useState("");
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const addAppliance = async () => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setAppliance({
        ...appliance,
        ownerName: userSnap.data().displayName,
      });
    }




    const savedAppliance = await addDoc(applianceCollection, appliance);
    if (!imageUri) return;
    console.log("didnt return");
    const imageUrl = await uploadImage(imageUri, savedAppliance.id);
    await updateDoc(doc(db, "appliances", savedAppliance.id), {
      url: imageUrl,
    });

    setAppliance(defaultAppliance);
    navigate("/(tabs)/two");
  };

  const uploadImage = async (uri: string, applianceId: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(
      storage,
      `appliances/${applianceId}.jpg`
    );

    await uploadBytes(imageRef, blob);

    const downloadUrl = await getDownloadURL(imageRef);

    return downloadUrl;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.inputContainer}>
          <View>
              <Text>Beschrijving</Text>
              <TextInput
              placeholder="Beschrijving..."
              value={appliance.description}
              onChangeText={(text) => setAppliance({...appliance, description: text})}
              style={styles.textinput}
              />
          </View>
        
        <SelectDropdown
          data={Categories}
          onSelect={(selectedItem) => setAppliance({...appliance, category: selectedItem})}
      
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || 'Selecteer de categorie van je toestel'}   {isOpened ? '' : 'v'}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={true}
          dropdownStyle={styles.dropdownMenuStyle}
          ></SelectDropdown>
          
        <TextInput
          inputMode='decimal'
          placeholder="Prijs"
          value={appliance.price.toString()}
          onChangeText={(text) => setAppliance({...appliance, price: Number.parseFloat(text)})}
          style={styles.textinput}
        
        />
        <View style={styles.imagePicker}>
          {imageUri && <Image
            source={{ uri: imageUri }}
            style={{ width: 350, height: 350 }}
          />}

          <Button title="Kies foto" onPress={pickImage} />
        </View>
        <TouchableOpacity style={styles.button} onPress={addAppliance}>
          <Text style={styles.boxText}>Voeg toe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    main: {
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      top: 10,
      color: "white",
      marginBottom: 30
    },
    titleContainer: {
      flex: 1,
      alignItems: "center",
      
    },
    todoContainer: {

    },
    container: { 
      paddingTop: Constants.statusBarHeight
    },
    inputContainer: {

    },
    textinput: { 
      borderColor: "red", 
      borderWidth: 1, 
      width: 350, 
      color: "black", 
      backgroundColor: "white", 
      borderRadius: 20, 
    },
    text: {
      color: "white"
    },
    boxText: {
      color: "black"
    },
    button: {
      borderColor: "grey",
      flex: 0,
      alignItems: "center",
      borderWidth: 1, 
      color: "black", 
      backgroundColor: "white", 
      borderRadius: 20, 
      marginBottom: 10,
      padding: 5,
    },
    dropdownButtonStyle: {
      width: 350,
      height: 50,
      backgroundColor: '#E9ECEF',
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    imagePicker: {
      flex: 0,
      alignItems: "center",
    }
});