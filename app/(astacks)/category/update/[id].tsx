import * as DocumentPicker from "expo-document-picker";
import {useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {Button, TextInput} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {getCategory, updateCategory, updateCategoryImage} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface CategoryProps {
  $id: string;
  name: string;
  image: string;
  imageId: string;
}

const UpdateCategory = () => {
  const {id} = useLocalSearchParams();
  const {data: category, refetch} = useAppwrite(() =>
    getCategory(id as string)
  );

  const typedCategory = category as unknown as CategoryProps;

  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0] as any);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const uploadImage = async () => {
    if (!avatar) {
      ToastAndroid.showWithGravityAndOffset(
        "Please select a image first.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    setUploading(true);
    try {
      await updateCategoryImage(
        typedCategory.$id,
        typedCategory.imageId,
        avatar
      );

      ToastAndroid.showWithGravityAndOffset(
        "Category image updated successfully.",
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
      setAvatar(null);
      setUploading(false);
    }
  };

  const update = async () => {
    if (name === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please provide all the fields.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    setSubmitting(true);
    try {
      await updateCategory(typedCategory.$id, name);

      await refetch();

      ToastAndroid.showWithGravityAndOffset(
        "Category updated successfully.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setSubmitting(false);
      setName("");
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
        <View className="my-10">
          <Image
            source={{uri: typedCategory.image}}
            alt="avatar"
            className="h-48 w-full rounded"
          />
          <View className="my-5 space-y-2">
            <Text className="text-base font-bold">Category Image</Text>
            <TouchableOpacity onPress={() => openPicker()}>
              {avatar ? (
                <Image
                  // @ts-ignore
                  source={{uri: avatar.uri}}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                  <FontAwesome5
                    name="cloud-upload-alt"
                    size={24}
                    color="black"
                  />
                  <Text className="text-sm font-bold">Choose a file</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Button
            mode="contained"
            onPress={uploadImage}
            buttonColor="#2563eb"
            loading={uploading}
            disabled={uploading}
          >
            Update Category Image
          </Button>
        </View>
        <View>
          <TextInput
            label="Category Name"
            defaultValue={typedCategory.name}
            onChangeText={(text) => setName(text)}
            mode="outlined"
            style={{marginBottom: 10}}
          />
          <Button
            mode="contained"
            onPress={update}
            buttonColor="#2563eb"
            loading={submitting}
            disabled={submitting}
          >
            Update Category
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateCategory;
