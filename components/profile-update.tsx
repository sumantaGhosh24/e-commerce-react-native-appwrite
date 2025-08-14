import {useState} from "react";
import {ScrollView, ToastAndroid, View} from "react-native";
import {Button, TextInput} from "react-native-paper";

import {getCurrentUser, updateUser} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface UserProps {
  $id: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
}

const ProfileUpdate = () => {
  const {data: user, refetch} = useAppwrite(() => getCurrentUser());

  const typedUser = user as unknown as UserProps;

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    city: typedUser.city,
    state: typedUser.state,
    country: typedUser.country,
    zip: typedUser.zip,
    addressline: typedUser.addressline,
  });

  const submit = async () => {
    if (
      form.city === "" ||
      form.state === "" ||
      form.country === "" ||
      form.zip === "" ||
      form.addressline === ""
    ) {
      ToastAndroid.showWithGravityAndOffset(
        "Please provide all the fields.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    setUploading(true);
    try {
      await updateUser({
        ...form,
        userId: typedUser.$id,
      });

      await refetch();

      ToastAndroid.showWithGravityAndOffset(
        "Profile updated successfully.",
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
      setUploading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="w-full flex justify-center h-full px-4 mb-20">
        <TextInput
          label="City"
          defaultValue={typedUser.city}
          onChangeText={(text) => setForm({...form, city: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="State"
          defaultValue={typedUser.state}
          onChangeText={(text) => setForm({...form, state: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="Country"
          defaultValue={typedUser.country}
          onChangeText={(text) => setForm({...form, country: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="Zip"
          defaultValue={typedUser.zip}
          onChangeText={(text) => setForm({...form, zip: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="Addressline"
          defaultValue={typedUser.addressline}
          onChangeText={(text) => setForm({...form, addressline: text})}
          mode="outlined"
          style={{marginBottom: 10}}
        />
        <Button
          mode="contained"
          onPress={submit}
          buttonColor="#2563eb"
          loading={uploading}
          disabled={uploading}
        >
          Update Profile
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileUpdate;
