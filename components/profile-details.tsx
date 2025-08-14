import {useState} from "react";
import {Image, RefreshControl, ScrollView, Text, View} from "react-native";

import {getCurrentUser} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface UserProps {
  avatar: string;
  avatarId: string;
  name: string;
  username: string;
  email: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
  $createdAt: any;
  $updatedAt: any;
}

const ProfileDetails = () => {
  const {data: user, refetch} = useAppwrite(() => getCurrentUser());

  const typedUser = user as unknown as UserProps;

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
      className="mt-10"
    >
      <Image
        source={{uri: typedUser.avatar}}
        alt={typedUser.avatarId}
        className="w-full h-[250px] rounded mb-4"
      />
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">Name: </Text>
        <Text className="capitalize text-lg">{typedUser.name}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">Username: </Text>
        <Text className="text-lg">{typedUser.username}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">Email: </Text>
        <Text className="text-lg">{typedUser.email}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">City: </Text>
        <Text className="capitalize text-lg">{typedUser.city}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">State: </Text>
        <Text className="capitalize text-lg">{typedUser.state}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">Country: </Text>
        <Text className="capitalize text-lg">{typedUser.country}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">Zip: </Text>
        <Text className="capitalize text-lg">{typedUser.zip}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">Addressline: </Text>
        <Text className="capitalize text-lg">{typedUser.addressline}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text className="font-bold text-xl">Created At: </Text>
        <Text className="capitalize text-lg">
          {new Date(typedUser.$createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View className="flex flex-row">
        <Text className="font-bold text-xl">Updated At: </Text>
        <Text className="capitalize text-lg">
          {new Date(typedUser.$updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileDetails;
