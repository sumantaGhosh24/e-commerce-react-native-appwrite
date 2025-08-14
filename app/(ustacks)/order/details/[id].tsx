import {useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {Image, RefreshControl, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {getBooking} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface BookingProps {
  $id: string;
  price: number;
  method: string;
  status: string;
  user: {
    avatar: string;
    name: string;
    username: string;
    email: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    addressline: string;
  };
  $createdAt: any;
  $updatedAt: any;
}

const OrderDetails = () => {
  const {id} = useLocalSearchParams();
  const {data: booking, refetch} = useAppwrite(() => getBooking(id as string));

  const typedBooking = booking as unknown as BookingProps;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="w-[95%] mx-auto my-10"
      >
        <View className="flex flex-row items-center mb-4">
          <Text className="font-semibold text-2xl">Order ID: </Text>
          <Text className="font-bold text-2xl">{typedBooking.$id}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-lg font-semibold">Price: </Text>
          <Text className="text-lg font-bold">{typedBooking.price}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-lg font-semibold">Method of Payment : </Text>
          <View className="bg-primary rounded-xl">
            <Text className="text-white p-2 uppercase font-bold">
              {typedBooking.method}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-lg font-semibold">Order Status: </Text>
          <View
            className={`rounded-xl ${
              typedBooking.status === "success"
                ? "bg-green-500"
                : typedBooking.status === "pending"
                  ? "bg-orange-500"
                  : "bg-red-500"
            }`}
          >
            <Text className="text-white p-2 uppercase font-bold">
              {typedBooking.status}
            </Text>
          </View>
        </View>
        <View className="border-2 border-primary rounded p-3 mb-4">
          <Text className="text-lg font-semibold mb-3">User Details: </Text>
          <View className="flex flex-row items-center">
            <Image
              source={{uri: typedBooking?.user?.avatar}}
              resizeMode="cover"
              className="h-16 w-16 rounded-full mr-5"
            />
            <View className="space-y-2">
              <Text className="font-medium capitalize">
                {typedBooking?.user?.name}
              </Text>
              <Text className="font-medium">
                {typedBooking?.user?.username}
              </Text>
              <Text className="font-medium">{typedBooking?.user?.email}</Text>
            </View>
          </View>
        </View>
        <View className="border-2 border-primary rounded p-3 mb-4">
          <Text className="text-lg font-semibold mb-3">User Address: </Text>
          <View className="space-y-2">
            <Text className="capitalize font-medium">
              City: {typedBooking?.user?.city}
            </Text>
            <Text className="capitalize font-medium">
              State: {typedBooking?.user?.state}
            </Text>
            <Text className="capitalize font-medium">
              Country: {typedBooking?.user?.country}
            </Text>
            <Text className="capitalize font-medium">
              Zip: {typedBooking?.user?.zip}
            </Text>
            <Text className="capitalize font-medium">
              Addressline: {typedBooking?.user?.addressline}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="font-semibold">
            Created At: {new Date(typedBooking.$createdAt).toLocaleDateString()}
          </Text>
          <Text className="font-semibold">
            Created At: {new Date(typedBooking.$updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;
