import {Text, View} from "react-native";
import {Redirect, Tabs} from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {useGlobalContext} from "../../../context/GlobalProvider";

const TabIcon = ({icon, color, name, focused}) => {
  return (
    <View className="flex items-center justify-center gap-2">
      {icon}
      <Text
        className={`${focused ? "font-semibold" : ""} text-xs`}
        style={{color: color}}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const {loading, isAdmin} = useGlobalContext();

  if (!loading && isAdmin) return <Redirect href="/profile" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="(drawer)"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={<FontAwesome name="home" size={24} color={color} />}
                name="Home"
                focused={focused}
                color="white"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={<FontAwesome name="user" size={24} color={color} />}
                name="Profile"
                focused={focused}
                color="white"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={
                  <FontAwesome name="shopping-cart" size={24} color={color} />
                }
                name="Cart"
                focused={focused}
                color="white"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
