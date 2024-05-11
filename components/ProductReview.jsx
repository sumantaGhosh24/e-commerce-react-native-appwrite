import {useState} from "react";
import {Text, View, Alert} from "react-native";
import {Button, TextInput} from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";

import {useGlobalContext} from "../context/GlobalProvider";
import {createReview, getProductReview} from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";
import ReviewCard from "./ReviewCard";

const ProductReview = ({product}) => {
  const {data: reviews, refetch} = useAppwrite(() => getProductReview(product));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const {user} = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    message: "",
    rating: null,
  });

  const submit = async () => {
    if (form.message === "" || !form.rating) {
      return Alert.alert("Error", "Please fill all the fields.");
    }

    setIsSubmitting(true);
    try {
      await createReview({...form, userId: user.$id, productId: product});

      Alert.alert("Success", "Review created successfully.");

      setForm({
        message: "",
        rating: null,
      });

      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View className="my-10 border-2 border-primary p-2 rounded">
        <Text className="text-2xl font-semibold mb-3">Post Review</Text>
        <TextInput
          label="Review Message"
          value={form.message}
          onChangeText={(text) => setForm({...form, message: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <TextInput
          label="Review Rating"
          value={form.rating}
          onChangeText={(text) => setForm({...form, rating: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <Button
          mode="contained"
          onPress={submit}
          buttonColor="#2563eb"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Post Review
        </Button>
      </View>
      <View className="p-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl font-semibold mb-3">Product Reviews</Text>
          <Feather
            name={!refreshing ? "refresh-ccw" : "wifi"}
            color="black"
            size={24}
            onPress={onRefresh}
          />
        </View>
        {reviews.length == 0 ? (
          <Text className="text-center mt-5 font-medium text-lg">
            No reviews found.
          </Text>
        ) : (
          reviews?.map((review) => (
            <ReviewCard review={review} key={review.$id} />
          ))
        )}
      </View>
    </>
  );
};

export default ProductReview;
