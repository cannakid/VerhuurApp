import { Text, TextInput, View, StyleSheet, Pressable, TouchableOpacity} from "react-native";
import Constants from "expo-constants";
import { useState } from "react";
import Search from "./app/search";
import { auth } from "../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import Appliance from "./interfaces/appliance";

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
  }

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.textinput} placeholder="email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.textinput} placeholder="password" value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.boxText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.boxText}>Make Account</Text>
      </TouchableOpacity>
    </View>
  )


  /*
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  
  
  const submit = () => {
    console.log(username);
    console.log(password);
    setUsername("");
    setPassword("");
  }

  return (
    <View
      style={{
          height: 720,
        }}
    >
      <View style={styles.titleContainer}>
      <Text
          style={styles.title}
        >De verhuurders</Text>
        </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       
        <Text style={styles.text}>Login or register</Text>
        <TextInput 
          placeholder="username"
          keyboardType="default"
          style={styles.textinput}
          value={username}
          onChangeText={(text) => setUsername(text)}
          ></TextInput>
        
        <TextInput 
          secureTextEntry={true}
          placeholder="password"
          keyboardType="default"
          style={styles.textinput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          ></TextInput>
          <Pressable
        onPress={submit}
        style={styles.submit}
        ><Text style={styles.boxText}>Submit</Text></Pressable>
        <Search></Search>
      </View>
    </View>
  );
  */
}


const styles = StyleSheet.create({
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
    container: { 
      paddingTop: Constants.statusBarHeight
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
    }
});

/*
      borderColor: "red",
      borderWidth: 1,
*/


