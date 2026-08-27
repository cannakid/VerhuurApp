import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { db } from "../../FirebaseConfig";
import { collection, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";
import Appliance from "../interfaces/appliance";

export default function TabTwoScreen() {
  const [appliance, setAppliance] = useState<Appliance>();
  const auth = getAuth();
  const user = auth.currentUser;
  const applianceCollection = collection(db, "appliances");

  const updateTodo = async (id: string, completed: any) => {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, { completed: !completed });
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.title}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Task"
            value={appliance?.description}
            style={styles.textinput}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateTodo("", false)}
          >
            <Text style={styles.boxText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  todoContainer: {},
  container: {
    paddingTop: Constants.statusBarHeight,
  },
  inputContainer: {},
  textinput: {
    borderColor: "red",
    borderWidth: 1,
    width: 200,
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
});
