import {useState} from "react";
import {Alert, RefreshControl, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, TextInput} from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import {useLocalSearchParams} from "expo-router";

import {
  getAllCategory,
  getProduct,
  updateProduct,
} from "../../../../lib/appwrite";
import useAppwrite from "../../../../lib/useAppwrite";

const UpdateProduct = () => {
  const {id} = useLocalSearchParams();
  const {data: product, refetch} = useAppwrite(() => getProduct(id));
  const {data: categories} = useAppwrite(() => getAllCategory());

  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const submit = async () => {
    if (
      form.title === "" ||
      form.description === "" ||
      form.price === "" ||
      form.category === ""
    ) {
      return Alert.alert("Error", "Please fill all the fields.");
    }

    setIsSubmitting(true);
    try {
      await updateProduct(product.$id, form);

      Alert.alert("Success", "Product updated successfully.");

      await refetch();
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
        className="mx-4"
      >
        <Text className="text-2xl font-bold my-5">Update Product</Text>
        <TextInput
          label="Product Title"
          defaultValue={product.title}
          onChangeText={(text) => setForm({...form, title: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <TextInput
          label="Product Description"
          defaultValue={product.description}
          onChangeText={(text) => setForm({...form, description: text})}
          mode="outlined"
          style={{marginBottom: 10, height: 150, textAlignVertical: "top"}}
          numberOfLines={5}
          multiline={true}
        />
        <TextInput
          label="Product Price"
          defaultValue={product?.price?.toString()}
          onChangeText={(text) => setForm({...form, price: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <View className="my-3 bg-white p-2 rounded-md border border-gray-600">
          <Text>Product Category ({product?.category?.name})</Text>
          <RNPickerSelect
            onValueChange={(value) => setForm({...form, category: value})}
            items={categories.map((cat) => ({
              label: cat.name,
              value: cat.$id,
            }))}
          />
        </View>
        <Button
          mode="contained"
          onPress={submit}
          buttonColor="#2563eb"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Update Product
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProduct;
