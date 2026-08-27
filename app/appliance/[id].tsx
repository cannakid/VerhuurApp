import { View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

interface Input {
  id: string;
}

export default function Appliance() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text style={styles.test}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    color: "white",
  },
});
