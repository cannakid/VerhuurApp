import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { db } from "../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Appliance, { GeoLocation } from "../interfaces/appliance";
import { router, useFocusEffect } from "expo-router";
import categories, { Category } from "../interfaces/categories";
import * as Location from "expo-location";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { navigate } from "expo-router/build/global-state/routing";

export default function TabOneScreen() {
  const [appliances, setAppliances] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | "Alle toestellen"
  >("Alle toestellen");

  const applianceCollection = collection(db, "appliances");

  useFocusEffect(
    useCallback(() => {
      fetchAppliances();
    }, []),
  );

  const fetchAppliances = async () => {
    const snapshot = await getDocs(applianceCollection);

    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setAppliances(data as Appliance[]);
  };

  const [location, setLocation] = useState<GeoLocation | null>(null);

  const [showMap, setShowMap] = useState(false);

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

  const [preferredDistance, setPreferredDistance] = useState(0);
  const [preferredDistanceString, setPreferredDistanceString] = useState("");

  const calculateDistance = (l1: GeoLocation, l2: GeoLocation) => {
    const dLat = ((l1.latitude - l2.latitude) * Math.PI) / 180;
    const dLon = ((l1.longitude - l2.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((l1.latitude * Math.PI) / 180) *
        Math.cos((l2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return 6371 * c; // 6371 is de gemiddelde radius van de aarde, kan een apparte constante zijn maar zou normaal niet veranderen
  };

  const filteredAppliances = useMemo(() => {
    return appliances
      .map((item: any) => {
        let distance = 0;
        if (location) {
          distance = calculateDistance(item.location, location);
        }
        return { ...item, distance: distance };
      })
      .filter((item: any) => {
        // Categorie filter
        const categoryMatches =
          selectedCategory === "Alle toestellen" ||
          item.category === selectedCategory;

        // Locatiefilter
        let locationMatches = true;
        if (location && preferredDistance != 0) {
          if (item.distance > preferredDistance) locationMatches = false;
        }

        return categoryMatches && locationMatches;
      });
  }, [selectedCategory, location, preferredDistance, appliances]);

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.title}>Catalogus</Text>

        <View style={styles.filters}>
          {/* CATEGORIE */}
          <Text style={styles.filterTitle}>Categorie</Text>

          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() => {
                  if (selectedCategory != category)
                    setSelectedCategory(category);
                  else setSelectedCategory("Alle toestellen");
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* LOCATIE */}
          <Text style={styles.filterTitle}>Locatie</Text>
          <View>
            <Text>Maximale afstand</Text>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="Maximale afstand"
              value={preferredDistanceString}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, "");
                setPreferredDistanceString(cleaned);
                if (cleaned) setPreferredDistance(Number.parseFloat(cleaned));
                else setPreferredDistance(0);
              }}
              style={styles.textinput}
            ></TextInput>
          </View>

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

        <FlatList
          data={filteredAppliances}
          renderItem={({ item }) => (
            <Pressable
              style={styles.applianceContainer}
              onPress={() => router.push(`/appliance/${item.id}`)}
            >
              {item.url && (
                <Image source={{ uri: item.url }} style={styles.image} />
              )}
              <View style={styles.applianceText}>
                <Text style={styles.description}>{item.description}</Text>

                <Text style={styles.text}>Categorie: {item.category}</Text>

                <Text style={styles.text}>
                  Prijs: €{item.price.toFixed(2)}/dag
                </Text>

                <Text
                  style={[
                    styles.availability,
                    item.available ? styles.available : styles.unavailable,
                  ]}
                >
                  {item.available ? "Beschikbaar" : "Niet beschikbaar"}
                </Text>

                <Text style={styles.text}>Eigenaar: {item.ownerName}</Text>

                <Text style={styles.distance}>
                  {item.distance.toFixed(1)} km van je gekozen locatie
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },

  filters: {
    marginBottom: 15,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e1e1e1",
  },

  categoryButtonSelected: {
    backgroundColor: "#007AFF",
  },

  categoryText: {
    color: "#333",
  },

  categoryTextSelected: {
    color: "white",
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

  locationText: {
    marginTop: 8,
    color: "#555",
  },

  applianceContainer: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#e1e1e1",
  },
  applianceText: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },

  description: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  text: {
    marginTop: 4,
  },

  availability: {
    marginTop: 8,
    fontWeight: "bold",
  },

  available: {
    color: "green",
  },

  unavailable: {
    color: "red",
  },
  textinput: {
    color: "black",
  },

  distance: {
    position: "absolute",
    right: 5,
    top: 5,
    fontWeight: "bold",
  },
});
