import {Redirect, Stack} from "expo-router";

import {useGlobalContext} from "../../../context/GlobalProvider";

const StackLayout = () => {
  const {loading, isAdmin} = useGlobalContext();

  if (!loading && isAdmin) return <Redirect href="/profile" />;

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
