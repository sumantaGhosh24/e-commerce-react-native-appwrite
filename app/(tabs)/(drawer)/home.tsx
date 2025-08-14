import {router} from "expo-router";
import {useState} from "react";
import {FlatList, Image, RefreshControl, Text, View} from "react-native";
import {Button} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";

import {ProductCard, SearchInput} from "@/components";
import {useGlobalContext} from "@/context/global-provider";
import {getAllProduct} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface ProductProps {
  $id: string;
  title: string;
  description: string;
  price: number;
  category: {
    name: string;
    image: string;
  };
  images: string[];
}

const Home = () => {
  const {isAdmin} = useGlobalContext();
  const {data: products, refetch} = useAppwrite(getAllProduct);

  const typedProducts = products as unknown as ProductProps[];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
      <FlatList
        data={typedProducts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => <ProductCard product={item} />}
        ListHeaderComponent={() => (
          <View className="flex p-4 space-y-6 bg-primary mx-3 rounded mb-5">
            <View className="flex justify-between items-start flex-row mb-3">
              <Text className="text-2xl font-semibold text-white">
                Explore Products
              </Text>
              <Image
                source={require("../../../assets/icon.png")}
                className="w-9 h-10"
                resizeMode="contain"
              />
            </View>
            <SearchInput />
            {isAdmin && (
              <Button
                onPress={() => router.push("/dashboard")}
                buttonColor="#1ac50e"
                textColor="#fff"
                className="mt-3"
              >
                Admin Dashboard
              </Button>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center mt-5 font-bold text-xl">
            No Products found.
          </Text>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
