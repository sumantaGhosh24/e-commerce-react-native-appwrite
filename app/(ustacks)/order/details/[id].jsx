import {useState} from "react";
import {Text, View, ScrollView, RefreshControl, Image} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";

import {getBooking} from "../../../../lib/appwrite";
import useAppwrite from "../../../../lib/useAppwrite";

const OrderDetails = () => {
  const {id} = useLocalSearchParams();
  const {data: booking, refetch} = useAppwrite(() => getBooking(id));

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
        className="w-[95%] mx-auto my-10 space-y-3"
      >
        <View className="flex flex-row items-center">
          <Text className="font-semibold text-2xl">Order ID: </Text>
          <Text className="font-bold text-2xl">{booking.$id}</Text>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-lg font-semibold">Price: </Text>
          <Text className="text-lg font-bold">{booking.price}</Text>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-lg font-semibold">Method of Payment : </Text>
          <View className="bg-primary rounded-xl">
            <Text className="text-white p-2 uppercase font-bold">
              {booking.method}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-lg font-semibold">Order Status: </Text>
          <View
            className={`rounded-xl ${
              booking.status === "success"
                ? "bg-green-500"
                : booking.status === "pending"
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
          >
            <Text className="text-white p-2 uppercase font-bold">
              {booking.status}
            </Text>
          </View>
        </View>
        <View className="border-2 border-primary rounded p-3">
          <Text className="text-lg font-semibold mb-3">User Details: </Text>
          <View className="flex flex-row items-center">
            <Image
              source={{uri: booking?.user?.avatar}}
              resizeMode="cover"
              className="h-16 w-16 rounded-full mr-5"
            />
            <View className="space-y-2">
              <Text className="font-medium capitalize">
                {booking?.user?.name}
              </Text>
              <Text className="font-medium">{booking?.user?.username}</Text>
              <Text className="font-medium">{booking?.user?.email}</Text>
            </View>
          </View>
        </View>
        <View className="border-2 border-primary rounded p-3">
          <Text className="text-lg font-semibold mb-3">User Address: </Text>
          <View className="space-y-2">
            <Text className="capitalize font-medium">
              City: {booking?.user?.city}
            </Text>
            <Text className="capitalize font-medium">
              State: {booking?.user?.state}
            </Text>
            <Text className="capitalize font-medium">
              Country: {booking?.user?.country}
            </Text>
            <Text className="capitalize font-medium">
              Zip: {booking?.user?.zip}
            </Text>
            <Text className="capitalize font-medium">
              Addressline: {booking?.user?.addressline}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="font-semibold">
            Created At: {new Date(booking.$createdAt).toLocaleDateString()}
          </Text>
          <Text className="font-semibold">
            Created At: {new Date(booking.$updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;
