import {Image, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {Redirect, router} from "expo-router";
import {Button} from "react-native-paper";

import {useGlobalContext} from "../context/GlobalProvider";
import {Loader} from "../components";

const Onboarding = () => {
  const {loading, isLogged} = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <SafeAreaView className="h-full">
        <Loader isLoading={loading} />

        <ScrollView>
          <View className="w-full flex items-center h-full px-4 mt-10 mb-20">
            <Image
              source={require("../assets/icon.png")}
              className="w-20 h-20 mb-5 rounded-full"
              resizeMode="cover"
            />

            <Image
              source={require("../assets/images/onboarding.jpg")}
              className="max-w-[380px] w-full h-[298px] mb-5"
              style={{borderRadius: 10}}
              resizeMode="cover"
            />

            <View className="relative mb-5">
              <Text className="text-3xl font-bold text-center text-black">
                Discover Latest{"\n"}
                And Popular <Text className="text-secondary">Products</Text>
              </Text>
            </View>

            <Text className="text-sm font-semibold text-black mb-5 text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, sapiente
            </Text>

            <Button
              mode="contained"
              onPress={() => router.push("/sign-in")}
              buttonColor="#2563eb"
            >
              Continue with Email
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar backgroundColor="#2563eb" style="light" />
    </>
  );
};

export default Onboarding;
