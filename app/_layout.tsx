import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {PaperProvider} from "react-native-paper";
import "react-native-url-polyfill/auto";

import GlobalProvider from "@/context/global-provider";

import "../global.css";

const RootLayout = () => {
  return (
    <>
      <GlobalProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="(auth)" options={{headerShown: false}} />
            <Stack.Screen name="(ustacks)" options={{headerShown: false}} />
            <Stack.Screen name="(astacks)" options={{headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          </Stack>
        </PaperProvider>
      </GlobalProvider>
      <StatusBar style="dark" />
    </>
  );
};

export default RootLayout;
