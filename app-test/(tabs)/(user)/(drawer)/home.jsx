import {useState} from "react";
import {FlatList, Image, RefreshControl, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {ProductCard, SearchInput} from "../../../../components";
import {getAllProduct} from "../../../../lib/appwrite";
import useAppwrite from "../../../../lib/useAppwrite";

const Home = () => {
  const {data: products, refetch} = useAppwrite(getAllProduct);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
      <FlatList
        data={products}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => <ProductCard product={item} />}
        ListHeaderComponent={() => (
          <View className="flex p-4 space-y-6 bg-primary mx-3 rounded mb-5">
            <View className="flex justify-between items-start flex-row mb-3">
              <Text className="text-2xl font-semibold text-white">
                Explore Products
              </Text>
              <Image
                source={require("../../../../assets/icon.png")}
                className="w-9 h-10"
                resizeMode="contain"
              />
            </View>
            <SearchInput />
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
