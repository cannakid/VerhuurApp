import { Text, TextInput, View, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function Index() {
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
          ></TextInput>
        <TextInput 
          secureTextEntry={true}
          placeholder="password"
          keyboardType="default"
          style={styles.textinput}
          ></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { paddingTop: Constants.statusBarHeight},
    textinput: { borderColor: "red", borderWidth: 1, width: 200}
});
