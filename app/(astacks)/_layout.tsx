import {Redirect, Stack} from "expo-router";

import {useGlobalContext} from "@/context/global-provider";

const StackLayout = () => {
  const {loading, isAdmin, isLogged} = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  if (!loading && !isAdmin) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen name="(drawer)" options={{headerShown: false}} />
        <Stack.Screen name="category/create" options={{headerShown: false}} />
        <Stack.Screen
          name="category/update/[id]"
          options={{headerShown: false}}
        />
        <Stack.Screen name="product/create" options={{headerShown: false}} />
        <Stack.Screen
          name="product/update/[id]"
          options={{headerShown: false}}
        />
        <Stack.Screen name="order/update/[id]" options={{headerShown: false}} />
      </Stack>
    </>
  );
};

export default StackLayout;
