import {Redirect, Stack} from "expo-router";

import {useGlobalContext} from "../../../context/GlobalProvider";

const StackLayout = () => {
  const {loading, isAdmin} = useGlobalContext();

  if (!loading && !isAdmin) return <Redirect href="/profile" />;

  return (
    <>
      <Stack>
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
