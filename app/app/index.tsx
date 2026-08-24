import { Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import Constants from "expo-constants";
import { useState } from "react";

export default function Index() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  
  
  const submit = () => {
    console.log(username);
    console.log(password);
    setUsername("");
    setPassword("")
  }

  return (
    <View
      style={{
          height: 720,
        }}
    >
      <Text
          style={{
          fontSize: 30,
          fontWeight: "bold",
          top: 10,
        }}
        >De verhuurders</Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       
        <Text>Login or register</Text>
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
        ><Text>Submit</Text></Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: { paddingTop: Constants.statusBarHeight},
    textinput: { borderColor: "red", borderWidth: 1, width: 200}
}); 


