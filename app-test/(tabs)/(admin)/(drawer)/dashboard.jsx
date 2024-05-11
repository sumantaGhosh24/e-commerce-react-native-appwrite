import {useState} from "react";
import {View, Text, ScrollView, RefreshControl} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {getDashboard} from "../../../../lib/appwrite";
import useAppwrite from "../../../../lib/useAppwrite";

const Dashboard = () => {
  const {data, refetch} = useAppwrite(() => getDashboard());

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
        showsVerticalScrollIndicator={false}
        className="px-3"
      >
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">User: </Text>
          <Text className="text-xl font-bold">{data.user}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Category: </Text>
          <Text className="text-xl font-bold">{data.category}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Product: </Text>
          <Text className="text-xl font-bold">{data.product}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Review: </Text>
          <Text className="text-xl font-bold">{data.review}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">All Booking: </Text>
          <Text className="text-xl font-bold">{data.allBookingCount}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">COD Booking: </Text>
          <Text className="text-xl font-bold">{data.codBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Online Booking: </Text>
          <Text className="text-xl font-bold">{data.onlineBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Success Booking: </Text>
          <Text className="text-xl font-bold">{data.successBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Cancel Booking: </Text>
          <Text className="text-xl font-bold">{data.cancelBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Pending Booking: </Text>
          <Text className="text-xl font-bold">{data.pendingBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Total Sell: </Text>
          <Text className="text-xl font-bold">
            INR{" "}
            {data?.allBooking?.documents?.reduce((a, b) => a.price + b.price)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
