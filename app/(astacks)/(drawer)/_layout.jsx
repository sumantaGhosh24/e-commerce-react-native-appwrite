import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import {Redirect} from "expo-router";

import {useGlobalContext} from "../../../context/GlobalProvider";

const DrawerLayout = () => {
  const {loading, isAdmin} = useGlobalContext();

  if (!loading && !isAdmin) return <Redirect href="/home" />;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer initialRouteName="dashboard">
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
