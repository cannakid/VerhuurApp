import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { auth } from '../../FirebaseConfig';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import Constants from 'expo-constants';
import { useEffect } from 'react';


export default function TabOneScreen() {
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Out</Text>
      <TouchableOpacity style={styles.button} onPress={async () => await auth.signOut()}>
        <Text style={styles.text}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
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