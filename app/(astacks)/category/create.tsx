import * as DocumentPicker from "expo-document-picker";
import {router} from "expo-router";
import {useState} from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {Button, TextInput} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {createCategory} from "@/lib/appwrite";

const CreateCategory = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    image: null,
  });

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      setForm({
        ...form,
        image: result.assets[0] as any,
      });
    } else {
      setTimeout(() => {
        ToastAndroid.showWithGravityAndOffset(
          "Document picked" + JSON.stringify(result, null, 2),
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }, 100);
    }
  };

  const submit = async () => {
    if (form.name === "" || !form.image) {
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
      await createCategory(form);

      ToastAndroid.showWithGravityAndOffset(
        "Category created successfully.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      router.replace("/manage-category");
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setForm({
        name: "",
        image: null,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        className="w-full flex h-full px-4 mt-10 mb-20"
        style={{minHeight: Dimensions.get("window").height - 100}}
      >
        <Text className="text-2xl font-bold mb-5">Create Category</Text>
        <View className="mb-5 space-y-2">
          <Text className="text-base font-bold">Category Image</Text>
          <TouchableOpacity onPress={() => openPicker()}>
            {form.image ? (
              <Image
                // @ts-ignore
                source={{uri: form.image.uri}}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 rounded-2xl border-2 border-black flex justify-center items-center flex-row space-x-2">
                <FontAwesome5 name="cloud-upload-alt" size={24} color="black" />
                <Text className="text-sm font-bold">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          label="Category Name"
          value={form.name}
          onChangeText={(text) => setForm({...form, name: text})}
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
          Create Category
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateCategory;
