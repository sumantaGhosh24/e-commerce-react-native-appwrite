import * as DocumentPicker from "expo-document-picker";
import {useState} from "react";
import {
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {Button} from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {getCurrentUser, updateUserImage} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface UserProps {
  $id: string;
  avatarId: string;
  avatar: string;
}

const ProfileUpdateImage = () => {
  const {data: user, refetch} = useAppwrite(() => getCurrentUser());

  const typedUser = user as unknown as UserProps;

  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);

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

  const submit = async () => {
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
      await updateUserImage(typedUser.$id, avatar, typedUser.avatarId);

      ToastAndroid.showWithGravityAndOffset(
        "Profile image updated successfully.",
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

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="w-full flex justify-center h-full px-4 mb-20">
        <Image
          source={{uri: typedUser.avatar}}
          alt="avatar"
          className="h-64 w-full rounded-2xl"
        />
        <View className="my-5 space-y-2">
          <Text className="text-base font-bold">User Image</Text>
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
