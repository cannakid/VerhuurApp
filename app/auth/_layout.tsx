import { auth } from "@/FirebaseConfig";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";

export default function RootLayout() {
  return (
  
      <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }}  />
      </Stack>
  );
}
