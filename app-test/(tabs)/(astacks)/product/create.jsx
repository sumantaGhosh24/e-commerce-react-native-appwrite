import {useState} from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, TextInput} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import RNPickerSelect from "react-native-picker-select";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {router} from "expo-router";

import {useGlobalContext} from "../../../../context/GlobalProvider";
import useAppwrite from "../../../../lib/useAppwrite";
import {createProduct, getAllCategory} from "../../../../lib/appwrite";

const CreateProduct = () => {
  const {user} = useGlobalContext();

  const {data: categories} = useAppwrite(() => getAllCategory());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    images: null,
    category: null,
    price: null,
  });

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
      multiple: true,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        images: result.assets,
      });
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      form.title === "" ||
      form.description === "" ||
      !form.images ||
      !form.category ||
      !form.price
    ) {
      return Alert.alert("Error", "Please fill all the fields.");
    }

    setIsSubmitting(true);
    try {
      await createProduct({...form, user: user.$id});

      Alert.alert("Success", "Product created successfully.");

      router.push("/manage-product");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="w-full flex h-full px-4 mt-10 mb-20">
        <Text className="text-2xl font-bold mb-5">Create Product</Text>
        <View className="mb-5 space-y-2">
          <Text className="text-base font-bold">Product Images</Text>
          <TouchableOpacity onPress={() => openPicker()}>
            {form.images ? (
              <View className="flex flex-row gap-2">
                {form.images.map((img, i) => (
                  <Image
                    key={i}
                    source={{uri: img.uri}}
                    resizeMode="cover"
                    className="h-24 w-24 rounded-2xl"
                  />
                ))}
              </View>
            ) : (
              <View className="w-full h-16 px-4 rounded-2xl border-2 border-black flex justify-center items-center flex-row space-x-2">
                <FontAwesome5 name="cloud-upload-alt" size={24} color="black" />
                <Text className="text-sm font-bold">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          label="Product Title"
          value={form.title}
          onChangeText={(text) => setForm({...form, title: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <TextInput
          label="Product Description"
          value={form.description}
          onChangeText={(text) => setForm({...form, description: text})}
          mode="outlined"
          style={{marginBottom: 10, height: 150, textAlignVertical: "top"}}
          numberOfLines={5}
          multiline={true}
        />
        <TextInput
          label="Product Price"
          value={form.price}
          onChangeText={(text) => setForm({...form, price: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <View className="my-3 bg-white p-2 rounded-md border border-gray-600">
          <Text>Product Category</Text>
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
          Create Product
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateProduct;
