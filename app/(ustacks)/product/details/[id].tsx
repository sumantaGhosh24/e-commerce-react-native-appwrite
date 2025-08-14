import {useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {Button} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";

import {ProductReview} from "@/components";
import {useGlobalContext} from "@/context/global-provider";
import {addCartItem, getProduct} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface ProductProps {
  $id: string;
  title: string;
  images: string[];
  description: string;
  price: number;
  category: {
    name: string;
    image: string;
  };
  user: {
    avatar: string;
    accountId: string;
    name: string;
    username: string;
    email: string;
  };
  $createdAt: any;
  $updatedAt: any;
}

const ProductDetails = () => {
  const {user} = useGlobalContext();
  const {id} = useLocalSearchParams();
  const {data: product, refetch} = useAppwrite(() => getProduct(id as string));

  const typedProduct = product as unknown as ProductProps;

  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCart = async () => {
    if (!user || !id) {
      ToastAndroid.showWithGravityAndOffset(
        "Please fill all the fields.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await addCartItem(user.$id, id as string);
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="w-[95%] mx-auto my-10"
      >
        <Text className="text-2xl font-bold capitalize mb-4">
          {typedProduct?.title}
        </Text>
        {typedProduct?.images?.length > 0 && (
          <View className="mb-4">
            <Image
              source={{uri: typedProduct?.images[active]}}
              className="w-full h-[200px] rounded mb-4"
              resizeMode="cover"
            />
            <View className="flex flex-row gap-2">
              {typedProduct?.images?.map((img, i) => (
                <TouchableOpacity onPress={() => setActive(i)} key={i}>
                  <Image
                    source={{uri: img}}
                    className={`h-8 w-8 rounded-full ${
                      i === active && "h-12 w-12"
                    }`}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        <Text className="text-lg font-medium capitalize mb-4">
          {typedProduct?.description}
        </Text>
        <Text className="text-xl capitalize font-bold mb-4">
          {typedProduct?.price} ₹
        </Text>
        <View className="flex flex-row items-center border border-primary p-3 rounded mb-4">
          <Image
            source={{uri: typedProduct?.category?.image}}
            className="h-12 w-12 rounded mr-5"
          />
          <Text className="font-bold">{typedProduct?.category?.name}</Text>
        </View>
        <View className="flex flex-row items-center border border-primary p-3 rounded mb-4">
          <Image
            source={{uri: typedProduct?.user?.avatar}}
            alt={typedProduct?.user?.accountId}
            className="h-12 w-12 rounded mr-5"
          />
          <View className="space-y-1">
            <Text className="font-bold">{typedProduct?.user?.name}</Text>
            <Text className="font-bold">{typedProduct?.user?.username}</Text>
            <Text className="font-bold">{typedProduct?.user?.email}</Text>
          </View>
        </View>
        <Text className="capitalize font-bold mb-4">
          Created at: {new Date(typedProduct?.$createdAt).toLocaleDateString()}
        </Text>
        <Text className="capitalize font-bold mb-4">
          Updated at: {new Date(typedProduct?.$updatedAt).toLocaleDateString()}
        </Text>
        <Button
          mode="contained"
          onPress={handleCart}
          style={{marginBottom: 10}}
          loading={isSubmitting}
          disabled={isSubmitting}
          buttonColor="#2563eb"
        >
          Add to Cart
        </Button>
        <ProductReview product={typedProduct?.$id} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;
