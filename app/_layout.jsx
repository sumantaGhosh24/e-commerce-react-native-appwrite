import "react-native-url-polyfill/auto";
import {PaperProvider} from "react-native-paper";
import {Stack} from "expo-router";

import GlobalProvider from "../context/GlobalProvider";
import {StatusBar} from "expo-status-bar";

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
      <StatusBar backgroundColor="#2563eb" style="light" />
    </>
  );
};

export default RootLayout;
