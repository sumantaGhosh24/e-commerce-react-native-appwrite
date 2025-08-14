import {router} from "expo-router";
import {Image, Text, View} from "react-native";
import {IconButton} from "react-native-paper";

interface ProductCardProps {
  product: {
    $id: string;
    title: string;
    description: string;
    price: number;
    category: {
      name: string;
      image: string;
    };
    images: string[];
  };
}

const ProductCard = ({product}: ProductCardProps) => {
  return (
    <View className="w-[85%] mx-auto mb-5 border border-primary p-1 rounded">
      <Image
        source={{uri: product.images[0]}}
        className="h-[200px] w-full rounded-md mb-3"
        resizeMode="cover"
      />
      <View className="flex flex-row">
        <View className="p-3 mb-3">
          <Text className="text-2xl capitalize font-bold">{product.title}</Text>
          <Text className="text-lg leading-6 tracking-tighter my-3">
            {product.description}
          </Text>
          <Text className="font-extrabold mb-3">{product.price} ₹</Text>
          <View className="flex flex-row items-center gap-2">
            <Image
              source={{uri: product.category.image}}
              className="h-10 w-10 rounded"
              resizeMode="cover"
            />
            <Text className="capitalize font-bold">
              {product.category.name}
            </Text>
          </View>
        </View>
        <IconButton
          icon="eye"
          mode="contained"
          iconColor="#2563eb"
          size={28}
          onPress={() => router.push(`/product/details/${product.$id}`)}
        />
      </View>
    </View>
  );
};

export default ProductCard;
