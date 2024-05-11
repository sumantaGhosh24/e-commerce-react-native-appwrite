import "react-native-url-polyfill/auto";
import {PaperProvider} from "react-native-paper";
import {Stack} from "expo-router";

import GlobalProvider from "../context/GlobalProvider";

const RootLayout = () => {
  return (
    <GlobalProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="(auth)" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        </Stack>
      </PaperProvider>
    </GlobalProvider>
  );
};

export default RootLayout;
