import {StatusBar} from "expo-status-bar";
import {Redirect, Stack} from "expo-router";

import {Loader} from "../../components";
import {useGlobalContext} from "../../context/GlobalProvider";

const TabLayout = () => {
  const {loading, isLogged, isAdmin} = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      {isAdmin ? (
        <Stack>
          <Stack.Screen name="(admin)" options={{headerShown: false}} />
          <Stack.Screen name="(astacks)" options={{headerShown: false}} />
        </Stack>
      ) : (
        <Stack>
          <Stack.Screen name="(user)" options={{headerShown: false}} />
          <Stack.Screen name="(ustacks)" options={{headerShown: false}} />
        </Stack>
      )}

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#2563eb" style="light" />
    </>
  );
};

export default TabLayout;
