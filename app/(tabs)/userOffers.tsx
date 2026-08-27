import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
} from "react-native";
import React, { useState, useCallback } from "react";
import { db, storage } from "../../FirebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";
import { navigate } from "expo-router/build/global-state/routing";
import { useFocusEffect } from "expo-router";
import { deleteObject, ref } from "firebase/storage";

export default function TabTwoScreen() {
  const [appliances, setAppliances] = useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const applianceCollection = collection(db, "appliances");

  useFocusEffect(
    useCallback(() => {
      fetchAppliances();
    }, []),
  );

  const fetchAppliances = async () => {
    if (user) {
      const q = query(applianceCollection, where("userId", "==", user.uid));
      const data = await getDocs(q);
      setAppliances(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } else {
      console.log("No user logged in");
    }
  };

  const deleteAppliance = async (id: string) => {
    const applianceDoc = doc(db, "appliances", id);
    const applianceSnap = await getDoc(applianceDoc);
    const url = applianceSnap.data()?.url;
    await deleteDoc(applianceDoc);
    if (url) {
      try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      } catch (error: any) {
        console.error("Error deleting image: ", error);
      }
    }
    fetchAppliances();
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.title}>Todo List</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate("/(tabs)/addAppliance")}
        >
          <Text style={styles.boxText}>Add</Text>
        </TouchableOpacity>
        <FlatList
          data={appliances}
          renderItem={({ item }) => (
            <View style={styles.applianceContainer}>
              {item.url && (
                <Image source={{ uri: item.url }} style={styles.image} />
              )}
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
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => deleteAppliance(item.id)}
              >
                <Text style={styles.boxText}>Remove</Text>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    padding: 16,
  },
  applianceContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    position: "relative",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textinput: {
    borderColor: "red",
    borderWidth: 1,
    width: 200,
    color: "black",
    backgroundColor: "white",
    borderRadius: 20,
  },
  text: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  availability: {
    fontWeight: "bold",
    marginTop: 8,
  },

  available: {
    color: "green",
  },

  unavailable: {
    color: "red",
  },
  removeButton: {
    borderColor: "black",
    width: 75,
    borderWidth: 1,
    borderRadius: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 2,
    right: 2,
    padding: 2,
  },
});
