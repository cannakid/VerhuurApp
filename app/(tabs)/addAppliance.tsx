import {
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { db, storage } from "../../FirebaseConfig";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";
import Appliance, { GeoLocation } from "../interfaces/appliance";
import { navigate } from "expo-router/build/global-state/routing";
import SelectDropdown from "react-native-select-dropdown";
import Categories from "../interfaces/categories";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from "expo-location";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

export default function TabTwoScreen() {
  const defaultAppliance = {
    id: "",
    userId: getAuth().currentUser?.uid ?? "", // current user should never be null while someone can access this
    ownerName: "",
    description: "",
    category: "",
    url: "",
    price: 0,
    available: true,
    personalAvailable: true,
    location: null,
  };

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUser = async () => {
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
    };
    fetchUser();
  }, [user]);

  const [appliance, setAppliance] = useState<Appliance>(defaultAppliance);
  const [price, setPrice] = useState("");
  const applianceCollection = collection(db, "appliances");

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
    if (!appliance.location) {
      Alert.alert("Je hebt nog geen locatie geselecteerd");
      return;
    }

    const savedAppliance = await addDoc(applianceCollection, appliance);
    if (imageUri) {
      console.log("didnt return");
      const imageUrl = await uploadImage(imageUri, savedAppliance.id);
      await updateDoc(doc(db, "appliances", savedAppliance.id), {
        url: imageUrl,
      });
    }
    setAppliance(defaultAppliance);
    setImageUri("");
    navigate("/(tabs)/userOffers");
  };

  const uploadImage = async (uri: string, applianceId: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `appliances/${applianceId}.jpg`);

    await uploadBytes(imageRef, blob);

    const downloadUrl = await getDownloadURL(imageRef);

    return downloadUrl;
  };

  const [location, setLocation] = useState<GeoLocation | null>(null);

  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setAppliance({ ...appliance, location: location });
  }, [location]);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Locatietoegang geweigerd");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});

    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  };

  const selectLocationOnMap = (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;

    setLocation(coordinate);
    setShowMap(false);
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
            onChangeText={(text) =>
              setAppliance({ ...appliance, description: text })
            }
            style={styles.textinput}
          />
        </View>

        <SelectDropdown
          data={[...Categories]}
          onSelect={(selectedItem) =>
            setAppliance({ ...appliance, category: selectedItem })
          }
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem || "Selecteer de categorie van je toestel"}{" "}
                  {isOpened ? "" : "v"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={true}
          dropdownStyle={styles.dropdownMenuStyle}
        ></SelectDropdown>

        <TextInput
          keyboardType="decimal-pad"
          placeholder="Prijs"
          value={price}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9.]/g, "");
            setPrice(cleaned);
            if (cleaned)
              setAppliance({ ...appliance, price: Number.parseFloat(cleaned) });
          }}
          style={styles.textinput}
        />
        {/* LOCATIE */}
        <Text style={styles.text}>Locatie</Text>
        <View style={styles.locationButtons}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.locationButtonText}>📍 Mijn locatie</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowMap(!showMap)}
          >
            <Text style={styles.locationButtonText}>🗺️ Kies op kaart</Text>
          </TouchableOpacity>
        </View>

        {/* KAART */}
        {showMap && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude ?? 50.8503,
              longitude: location?.longitude ?? 4.3517,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={selectLocationOnMap}
          >
            {location && <Marker coordinate={location} />}
          </MapView>
        )}

        {/* GESELECTEERDE LOCATIE */}
        {location && (
          <Text style={styles.locationText}>
            📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      <View style={styles.imagePicker}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 350, height: 350 }}
          ></Image>
        )}
        {imageUri && (
          <TouchableOpacity
            style={styles.topRight}
            onPress={() => setImageUri("")}
          >
            <Text style={styles.cross}>x</Text>
          </TouchableOpacity>
        )}
        <Button title="Kies foto" onPress={pickImage} />
      </View>
      <TouchableOpacity style={styles.button} onPress={addAppliance}>
        <Text style={styles.boxText}>Voeg toe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {},
  title: {
    fontSize: 30,
    fontWeight: "bold",
    top: 10,
    color: "white",
    marginBottom: 30,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  locationText: {
    marginTop: 8,
    color: "#555",
  },
  container: {
    paddingTop: Constants.statusBarHeight,
  },
  inputContainer: {},
  textinput: {
    borderColor: "red",
    borderWidth: 1,
    width: 350,
    color: "black",
    backgroundColor: "white",
    borderRadius: 20,
  },
  text: {
    color: "white",
  },
  boxText: {
    color: "black",
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
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  imagePicker: {
    flex: 0,
    alignItems: "center",
  },
  topRight: {
    position: "absolute",
    top: 15,
    right: 40,
  },
  cross: {
    fontWeight: "bold",
    color: "red",
    fontSize: 30,
  },
  locationButtons: {
    flexDirection: "row",
    gap: 10,
  },

  locationButton: {
    backgroundColor: "#e1e1e1",
    padding: 12,
    borderRadius: 8,
  },

  locationButtonText: {
    fontWeight: "500",
  },
  map: {
    height: 250,
    marginTop: 10,
    borderRadius: 10,
  },
});
