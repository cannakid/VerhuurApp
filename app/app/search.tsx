import { View, Text, StyleSheet } from "react-native";
import Appliance from "../interfaces/appliance";
import Constants from "expo-constants";

export default function Search() {
    const appliances: Appliance[] = [];
    appliances.push({id: 1, description: 'test', category: "test", available: false, url: '', price: 15.5});
    appliances.push({id: 2, description: 'test2', category: "test2", available: false, url: '', price: 15.5});
    return (
        <View>
            {appliances.map((appliance) => <View>
                <Text style={styles.text}>{appliance.description}</Text>
            </View>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { paddingTop: Constants.statusBarHeight},
    textinput: { borderColor: "red", borderWidth: 1, width: 200, color: "black", backgroundColor: "white"},
    text: {color: "white"}
});