import {Redirect, Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";

import {Loader} from "../../components";
import {useGlobalContext} from "../../context/GlobalProvider";

const AuthLayout = () => {
  const {loading, isLogged} = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/profile" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#2563eb" style="light" />
    </>
  );
};

export default AuthLayout;
