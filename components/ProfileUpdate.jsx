import {useState} from "react";
import {Alert, ScrollView, View} from "react-native";
import {Button, TextInput} from "react-native-paper";

import {getCurrentUser, updateUser} from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";

const ProfileUpdate = () => {
  const {data: user, refetch} = useAppwrite(() => getCurrentUser());

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    city: user.city,
    state: user.state,
    country: user.country,
    zip: user.zip,
    addressline: user.addressline,
  });

  const submit = async () => {
    if (
      form.city === "" ||
      form.state === "" ||
      form.country === "" ||
      form.zip === "" ||
      form.addressline === ""
    ) {
      return Alert.alert("Please provide all the fields.");
    }

    setUploading(true);
    try {
      await updateUser({
        ...form,
        userId: user.$id,
      });

      await refetch();

      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="w-full flex justify-center h-full px-4 mb-20">
        <TextInput
          label="City"
          defaultValue={user.city}
          onChangeText={(text) => setForm({...form, city: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="State"
          defaultValue={user.state}
          onChangeText={(text) => setForm({...form, state: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="Country"
          defaultValue={user.country}
          onChangeText={(text) => setForm({...form, country: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="Zip"
          defaultValue={user.zip}
          onChangeText={(text) => setForm({...form, zip: text})}
          mode="outlined"
          style={{marginBottom: 5}}
        />
        <TextInput
          label="Addressline"
          defaultValue={user.addressline}
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
