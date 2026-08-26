import { Text, TextInput, View, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import Constants from "expo-constants";
import { useState } from "react";
import { auth } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
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

        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.boxText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigate("/auth/register")}>
          <Text style={styles.boxText}>Maak account</Text>
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


