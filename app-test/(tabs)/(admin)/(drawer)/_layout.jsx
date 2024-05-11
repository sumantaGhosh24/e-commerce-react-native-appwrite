import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {Link, Redirect, router} from "expo-router";

import {useGlobalContext} from "../../../../context/GlobalProvider";
import {signOut} from "../../../../lib/appwrite";

const DrawerLayout = () => {
  const {loading, isAdmin, setUser, setIsLogged} = useGlobalContext();

  if (!loading && !isAdmin) return <Redirect href="/profile" />;

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.push("/sign-in");
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        initialRouteName="dashboard"
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
          name="dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
          }}
        />
        <Drawer.Screen
          name="manage-category"
          options={{
            drawerLabel: "Manage Category",
            title: "Manage Category",
          }}
        />
        <Drawer.Screen
          name="manage-product"
          options={{
            drawerLabel: "Manage Product",
            title: "Manage Product",
          }}
        />
        <Drawer.Screen
          name="manage-order"
          options={{
            drawerLabel: "Manage Order",
            title: "Manage Order",
          }}
        />
        <Drawer.Screen
          name="manage-review"
          options={{
            drawerLabel: "Manage Review",
            title: "Manage Review",
          }}
        />
        <Drawer.Screen
          name="manage-user"
          options={{
            drawerLabel: "Manage User",
            title: "Manage User",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
