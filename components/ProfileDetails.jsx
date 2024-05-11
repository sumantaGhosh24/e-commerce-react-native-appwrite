import {useState} from "react";
import {Image, RefreshControl, ScrollView, Text, View} from "react-native";

import {getCurrentUser} from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";
import Loader from "./Loader";

const ProfileDetails = () => {
  const {data: user, refetch} = useAppwrite(() => getCurrentUser());

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
      className="mt-10 space-y-3"
    >
      <Image
        source={{uri: user.avatar}}
        alt={user.avatarId}
        className="w-full h-[250px] rounded"
      />
      <View className="flex flex-row">
        <Text>Name: </Text>
        <Text className="capitalize font-bold">{user.name}</Text>
      </View>
      <View className="flex flex-row">
        <Text>Username: </Text>
        <Text className="capitalize font-bold">{user.username}</Text>
      </View>
      <View className="flex flex-row">
        <Text>Email: </Text>
        <Text className="capitalize font-bold">{user.email}</Text>
      </View>
      <View className="flex flex-row">
        <Text>City: </Text>
        <Text className="capitalize font-bold">{user.city}</Text>
      </View>
      <View className="flex flex-row">
        <Text>State: </Text>
        <Text className="capitalize font-bold">{user.state}</Text>
      </View>
      <View className="flex flex-row">
        <Text>Country: </Text>
        <Text className="capitalize font-bold">{user.country}</Text>
      </View>
      <View className="flex flex-row">
        <Text>Zip: </Text>
        <Text className="capitalize font-bold">{user.zip}</Text>
      </View>
      <View className="flex flex-row">
        <Text>Addressline: </Text>
        <Text className="capitalize font-bold">{user.addressline}</Text>
      </View>
      <View className="flex flex-row">
        <Text>Created At: </Text>
        <Text className="capitalize font-bold">
          {new Date(user.$createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View className="flex flex-row mb-10">
        <Text>Updated At: </Text>
        <Text className="capitalize font-bold">
          {new Date(user.$updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileDetails;
