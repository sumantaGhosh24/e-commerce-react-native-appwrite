import {useState} from "react";
import {
  Text,
  ScrollView,
  RefreshControl,
  Image,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button} from "react-native-paper";
import {useLocalSearchParams} from "expo-router";

import {addCartItem, getProduct} from "../../../../../lib/appwrite";
import useAppwrite from "../../../../../lib/useAppwrite";
import {ProductReview} from "../../../../../components";
import {useGlobalContext} from "../../../../../context/GlobalProvider";

const ProductDetails = () => {
  const {user} = useGlobalContext();
  const {id} = useLocalSearchParams();
  const {data: product, refetch} = useAppwrite(() => getProduct(id));

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
      return Alert.alert("Error", "Please fill all the fields.");
    }

    setIsSubmitting(true);
    try {
      await addCartItem(user.$id, id);
    } catch (error) {
      Alert.alert("Error", error.message);
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
        className="w-[95%] mx-auto my-10 space-y-3"
      >
        <Text className="text-2xl font-bold capitalize">{product?.title}</Text>
        {product?.images?.length > 0 && (
          <View>
            <Image
              source={{uri: product?.images[active]}}
              className="w-full h-[200px] rounded mb-4"
              resizeMode="cover"
            />
            <View className="flex flex-row gap-2">
              {product?.images?.map((img, i) => (
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
        <Text className="text-sm font-medium capitalize">
          {product?.description}
        </Text>
        <Text className="text-sm font-extrabold className='capitalize font-bold'">
          INR: {product?.price}
        </Text>
        <View className="flex flex-row items-center border border-primary p-3 rounded">
          <Image
            source={{uri: product?.category?.image}}
            className="h-12 w-12 rounded mr-5"
          />
          <Text className="font-bold">{product?.category?.name}</Text>
        </View>
        <View className="flex flex-row items-center border border-primary p-3 rounded">
          <Image
            source={{uri: product?.user?.avatar}}
            alt={product?.user?.accountId}
            className="h-12 w-12 rounded mr-5"
          />
          <View className="space-y-1">
            <Text className="font-bold">{product?.user?.name}</Text>
            <Text className="font-bold">{product?.user?.username}</Text>
            <Text className="font-bold">{product?.user?.email}</Text>
          </View>
        </View>
        <Text className="capitalize font-bold">
          Created at: {new Date(product?.$createdAt).toLocaleDateString()}
        </Text>
        <Text className="capitalize font-bold">
          Updated at: {new Date(product?.$updatedAt).toLocaleDateString()}
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
        <ProductReview product={product?.$id} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;
