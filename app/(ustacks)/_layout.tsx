import {Redirect, Stack} from "expo-router";

import {useGlobalContext} from "@/context/global-provider";

const StackLayout = () => {
  const {loading, isLogged} = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Stack>
        <Stack.Screen name="search/[query]" options={{headerShown: false}} />
        <Stack.Screen
          name="product/details/[id]"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="order/details/[id]"
          options={{headerShown: false}}
        />
      </Stack>
    </>
  );
};

export default StackLayout;
