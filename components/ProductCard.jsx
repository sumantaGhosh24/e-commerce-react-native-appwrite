import {router} from "expo-router";
import {Image, StyleSheet, Text, View} from "react-native";
import {IconButton} from "react-native-paper";

const ProductCard = ({product}) => {
  return (
    <View className="flex flex-col items-center w-[85%] mx-auto mb-5 border border-primary p-1 rounded relative">
      <Image
        source={{uri: product.images[0]}}
        className="h-[200px] w-full rounded-md mb-3"
        resizeMode="cover"
      />
      <IconButton
        icon="eye"
        mode="contained"
        iconColor="#2563eb"
        size={28}
        onPress={() => router.push(`/product/details/${product.$id}`)}
        className="absolute top-1 right-1"
      />
      <View className="space-y-3 mb-3">
        <Text className="text-2xl capitalize font-bold">{product.title}</Text>
        <Text className="text-lg leading-6 tracking-tighter">
          {product.description}
        </Text>
        <Text className="font-extrabold">INR {product.price}</Text>
        <View className="flex flex-row items-center gap-2">
          <Image
            source={{uri: product.category.image}}
            className="h-10 w-10 rounded"
            resizeMode="cover"
          />
          <Text className="capitalize font-bold">{product.category.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
