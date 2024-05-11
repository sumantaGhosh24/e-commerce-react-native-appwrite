import {useState} from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, TextInput} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {useLocalSearchParams} from "expo-router";

import {
  getCategory,
  updateCategory,
  updateCategoryImage,
} from "../../../../../lib/appwrite";
import useAppwrite from "../../../../../lib/useAppwrite";

const UpdateCategory = () => {
  const {id} = useLocalSearchParams();
  const {data: category, refetch} = useAppwrite(() => getCategory(id));

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
      setAvatar(result.assets[0]);
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
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
      return Alert.alert("Please select a image first.");
    }

    setUploading(true);
    try {
      await updateCategoryImage(category.$id, category.imageId, avatar);

      Alert.alert("Success", "Profile image updated successfully.");

      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setAvatar(null);
      setUploading(false);
    }
  };

  const update = async () => {
    if (name === "") {
      return Alert.alert("Please provide all the fields.");
    }

    setSubmitting(true);
    try {
      await updateCategory(category.$id, name);

      await refetch();

      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
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
            source={{uri: category.image}}
            alt="avatar"
            className="h-48 w-full rounded"
          />
          <View className="my-5 space-y-2">
            <Text className="text-base font-bold">Category Image</Text>
            <TouchableOpacity onPress={() => openPicker()}>
              {avatar ? (
                <Image
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
            defaultValue={category.name}
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
