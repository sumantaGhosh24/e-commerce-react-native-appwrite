import {Text, View, Image} from "react-native";

const ReviewCard = ({review}) => {
  return (
    <View className="bg-white mt-3 p-3 rounded space-y-4">
      <View className="flex flex-row items-center">
        <Image
          source={{uri: review?.user?.avatar}}
          className="h-16 w-16 rounded-full mr-3"
        />
        <View className="space-y-1">
          <Text className="capitalize font-bold">{review?.user?.name}</Text>
          <Text className="font-bold">{review?.user?.username}</Text>
          <Text className="font-bold">{review?.user?.email}</Text>
        </View>
      </View>
      <View className="flex flex-row items-center">
        <Text className="mr-3 capitalize font-semibold">{review.message}</Text>
        <Text className="font-bold bg-primary py-1 px-2.5 rounded-full text-white">
          {review.rating}
        </Text>
      </View>
      <View className="flex flex-row items-center justify-between">
        <Text className="capitalize font-bold">
          Created At: {new Date(review.$createdAt).toLocaleDateString()}
        </Text>
        <Text className="capitalize font-bold">
          Updated At: {new Date(review.$updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default ReviewCard;
