import {useLocalSearchParams} from "expo-router";
import {useEffect} from "react";
import {FlatList, Image, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {ProductCard, SearchInput} from "@/components";
import {searchProduct} from "@/lib/appwrite";
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

const SearchProduct = () => {
  const {query} = useLocalSearchParams();
  const {data: products, refetch} = useAppwrite(() =>
    searchProduct(query as string)
  );

  const typedProducts = products as unknown as ProductProps[];

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="h-full">
      <FlatList
        data={typedProducts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => <ProductCard product={item} />}
        ListHeaderComponent={() => (
          <View className="flex p-4 space-y-6 bg-primary mx-3 rounded my-5">
            <View className="flex justify-between items-start flex-row mb-3">
              <View>
                <Text className="text-2xl font-semibold text-white">
                  Search Products
                </Text>
                <Text className="text-xl font-semibold mt-1">{query}</Text>
              </View>
              <Image
                source={require("../../../assets/icon.png")}
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
      />
    </SafeAreaView>
  );
};

export default SearchProduct;
