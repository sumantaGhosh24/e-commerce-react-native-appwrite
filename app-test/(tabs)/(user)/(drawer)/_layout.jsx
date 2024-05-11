import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {Redirect, router} from "expo-router";

import {useGlobalContext} from "../../../../context/GlobalProvider";
import {signOut} from "../../../../lib/appwrite";

const DrawerLayout = () => {
  const {loading, isAdmin, setUser, setIsLogged} = useGlobalContext();

  if (!loading && isAdmin) return <Redirect href="/profile" />;

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        initialRouteName="home"
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem label="Logout" onPress={logout} />
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="my-review"
          options={{
            drawerLabel: "My Review",
            title: "My Review",
          }}
        />
        <Drawer.Screen
          name="my-order"
          options={{
            drawerLabel: "My Order",
            title: "My Order",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
