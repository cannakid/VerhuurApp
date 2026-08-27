import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { auth, db, storage } from "../../FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setUsername(data.displayName || "");
          setPhotoURL(data.photoURL || null);
          setNewUsername(data.displayName || "");
        }
      } catch (error) {
        console.error("Fout bij ophalen profiel:", error);
      }
    };

    loadProfile();
  }, [user]);

  const updateUsername = async () => {
    if (!user) return;

    const trimmedUsername = newUsername.trim();

    if (!trimmedUsername) {
      Alert.alert("Fout", "Vul een gebruikersnaam in.");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: trimmedUsername,
        },
        { merge: true },
      );

      const appliancesQuery = query(
        collection(db, "appliances"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(appliancesQuery);

      const batch = writeBatch(db);

      snapshot.forEach((applianceDoc) => {
        batch.update(applianceDoc.ref, {
          ownerName: trimmedUsername,
        });
      });

      await batch.commit();

      setUsername(trimmedUsername);
      setEditingUsername(false);

      Alert.alert("Gelukt", "Je gebruikersnaam is aangepast.");
    } catch (error) {
      console.error(error);
      Alert.alert("Fout", "De gebruikersnaam kon niet worden aangepast.");
    }
  };

  const changeProfilePicture = async () => {
    if (!user) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Toestemming nodig",
        "Geef toestemming om foto's uit je galerij te kiezen.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (result.canceled) return;

    const imageUri = result.assets[0].uri;

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const imageRef = ref(storage, `users/${user.uid}.jpg`);

      await uploadBytes(imageRef, blob);

      const downloadUrl = await getDownloadURL(imageRef);

      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: downloadUrl },
        { merge: true },
      );

      setPhotoURL(downloadUrl);
    } catch (error) {
      console.error(error);
      Alert.alert("Fout", "De profielfoto kon niet worden aangepast.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profiel</Text>

      <TouchableOpacity
        style={styles.profilePictureContainer}
        onPress={changeProfilePicture}
      >
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.profilePicture} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.changePhotoText}>Profielfoto aanpassen</Text>

      <Text style={styles.label}>Gebruikersnaam</Text>

      {editingUsername ? (
        <View style={styles.usernameEditContainer}>
          <TextInput
            value={newUsername}
            onChangeText={setNewUsername}
            style={styles.input}
            placeholder="Gebruikersnaam"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveButton} onPress={updateUsername}>
            <Text style={styles.buttonText}>Opslaan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setNewUsername(username);
              setEditingUsername(false);
            }}
          >
            <Text style={styles.buttonText}>Annuleren</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.username}>
            {username || "Geen gebruikersnaam"}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditingUsername(true)}
          >
            <Text style={styles.buttonText}>Gebruikersnaam aanpassen</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Sign out */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={async () => await auth.signOut()}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  profilePictureContainer: {
    marginBottom: 8,
  },

  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    color: "#666",
  },

  changePhotoText: {
    color: "#007AFF",
    marginBottom: 30,
  },

  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },

  username: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },

  usernameEditContainer: {
    width: "100%",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },

  signOutButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
