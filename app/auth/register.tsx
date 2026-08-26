import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig";
import { useState } from "react";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Constants from "expo-constants";
import { navigate } from "expo-router/build/global-state/routing";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const signUp = async () => {
    try {
        /*
        const q = query(collection(db, "users"), where("displayName", "==", displayName));
        const data = await getDocs(q);
        if (data.size > 0) {
            alert('Iemand anders heeft die naam al');
            return;
        }
        */
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            email: user.email,
            displayName : displayName,
            rating: 0,
            reviewCount: 0,
            createdAt: serverTimestamp(),
        });

    } catch (error: any) {
          console.log(error)
          alert('Sign up failed: ' + error.message);
    }
    }

    return (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>De Verhuurders</Text>
          </View>
          <View style={styles.loginContainer}>
            <TextInput style={styles.textinput} placeholder="email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.textinput} placeholder="wachtwoord" value={password} onChangeText={setPassword} secureTextEntry/>
            <TextInput style={styles.textinput} placeholder="gebruikersnaam" value={displayName} onChangeText={setDisplayName} />
    
            <TouchableOpacity style={styles.button} onPress={signUp}>
              <Text style={styles.boxText}>Maak account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigate("/auth")}>
              <Text style={styles.boxText}>Terug naar login</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      )
}

const styles = StyleSheet.create({
    container: { 
      paddingTop: Constants.statusBarHeight,
      backgroundColor: "#2b2b2d",
      height: Dimensions.get("window").height, // may need to use events for reactivity
    },
    titleContainer: {
      alignItems: "center",
      marginTop: 30,
      marginBottom: 30
    },
    title: {
      fontSize: 40,
      fontWeight: "bold",
      color: "white",
    },
    loginContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    textinput: { 
      borderColor: "gray", 
      borderWidth: 1, 
      width: 300, 
      color: "black", 
      margin: 5,
      backgroundColor: "white", 
      borderRadius: 20, 
    },
    boxText: {
      color: "black"
    },
    button: {
      borderColor: "grey",
      alignItems: "center",
      width: 300,
      borderWidth: 1, 
      color: "black", 
      backgroundColor: "white", 
      borderRadius: 20, 
      margin: 5,
      padding: 5,
    },
});

