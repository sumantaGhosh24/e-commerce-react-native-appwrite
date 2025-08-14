import {useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {Button, TextInput} from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import {SafeAreaView} from "react-native-safe-area-context";

import {getAllCategory, getProduct, updateProduct} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface ProductProps {
  $id: string;
  title: string;
  description: string;
  category: any;
  price: string;
}

interface CategoryProps {
  $id: string;
  name: string;
}

const UpdateProduct = () => {
  const {id} = useLocalSearchParams();
  const {data: product, refetch} = useAppwrite(() => getProduct(id as string));
  const {data: categories} = useAppwrite(() => getAllCategory());

  const typedProduct = product as unknown as ProductProps;

  const typedCategories = categories as unknown as CategoryProps[];

  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: typedProduct.title,
    description: typedProduct.description,
    category: typedProduct.category,
    price: typedProduct.price,
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
      ToastAndroid.showWithGravityAndOffset(
        "Please fill all the fields.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProduct(typedProduct.$id, form);

      ToastAndroid.showWithGravityAndOffset(
        "Product updated successfully.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      await refetch();
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
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
          defaultValue={typedProduct.title}
          onChangeText={(text) => setForm({...form, title: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <TextInput
          label="Product Description"
          defaultValue={typedProduct.description}
          onChangeText={(text) => setForm({...form, description: text})}
          mode="outlined"
          style={{marginBottom: 10, height: 150, textAlignVertical: "top"}}
          numberOfLines={5}
          multiline={true}
        />
        <TextInput
          label="Product Price"
          defaultValue={typedProduct?.price?.toString()}
          onChangeText={(text) => setForm({...form, price: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <View className="my-3 bg-white p-2 rounded-md border border-gray-600">
          <Text>Product Category ({typedProduct?.category?.name})</Text>
          <RNPickerSelect
            onValueChange={(value) => setForm({...form, category: value})}
            items={typedCategories.map((cat) => ({
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
