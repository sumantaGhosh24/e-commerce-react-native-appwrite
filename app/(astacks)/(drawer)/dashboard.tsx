import {router} from "expo-router";
import {useState} from "react";
import {RefreshControl, ScrollView, Text, View} from "react-native";
import {Button} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";

import {getDashboard} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface DataProps {
  user: number;
  category: number;
  product: number;
  review: number;
  allBookingCount: number;
  codBooking: number;
  onlineBooking: number;
  successBooking: number;
  cancelBooking: number;
  pendingBooking: number;
  allBooking: any;
}

const Dashboard = () => {
  const {data, refetch} = useAppwrite(() => getDashboard());

  const typedData = data as unknown as DataProps;

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
        <Button
          onPress={() => router.push("/home")}
          buttonColor="#1ac50e"
          textColor="#fff"
          style={{marginBottom: 10}}
        >
          Home
        </Button>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">User: </Text>
          <Text className="text-xl font-bold">{typedData.user}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Category: </Text>
          <Text className="text-xl font-bold">{typedData.category}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Product: </Text>
          <Text className="text-xl font-bold">{typedData.product}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Review: </Text>
          <Text className="text-xl font-bold">{typedData.review}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">All Booking: </Text>
          <Text className="text-xl font-bold">{typedData.allBookingCount}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">COD Booking: </Text>
          <Text className="text-xl font-bold">{typedData.codBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Online Booking: </Text>
          <Text className="text-xl font-bold">{typedData.onlineBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Success Booking: </Text>
          <Text className="text-xl font-bold">{typedData.successBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Cancel Booking: </Text>
          <Text className="text-xl font-bold">{typedData.cancelBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Pending Booking: </Text>
          <Text className="text-xl font-bold">{typedData.pendingBooking}</Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-xl font-semibold">Total Sell: </Text>
          <Text className="text-xl font-bold">
            {typedData?.allBooking?.total > 0
              ? typedData?.allBooking?.documents?.reduce(
                  (acc: any, b: {price: any}) => acc + b.price,
                  0
                )
              : 0}{" "}
            ₹
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
