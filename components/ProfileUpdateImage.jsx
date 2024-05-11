import {useState} from "react";
import {
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import {Button} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {getCurrentUser, updateUserImage} from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";

const ProfileUpdateImage = () => {
  const {data: user, refetch} = useAppwrite(() => getCurrentUser());

  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);

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

  const submit = async () => {
    if (!avatar) {
      return Alert.alert("Please select a image first.");
    }

    setUploading(true);
    try {
      await updateUserImage(user.$id, avatar, user.avatarId);

      Alert.alert("Success", "Profile image updated successfully.");

      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setAvatar(null);
      setUploading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="w-full flex justify-center h-full px-4 mb-20">
        <Image
          source={{uri: user.avatar}}
          alt="avatar"
          className="h-48 w-48 rounded"
        />
        <View className="my-5 space-y-2">
          <Text className="text-base font-bold">User Image</Text>
          <TouchableOpacity onPress={() => openPicker()}>
            {avatar ? (
              <Image
                source={{uri: avatar.uri}}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <FontAwesome5 name="cloud-upload-alt" size={24} color="black" />
                <Text className="text-sm font-bold">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Button
          mode="contained"
          onPress={submit}
          buttonColor="#2563eb"
          loading={uploading}
          disabled={uploading}
        >
          Update Profile Image
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileUpdateImage;
