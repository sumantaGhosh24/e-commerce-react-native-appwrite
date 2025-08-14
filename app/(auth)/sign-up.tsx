import * as DocumentPicker from "expo-document-picker";
import {Link, router} from "expo-router";
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

import {useGlobalContext} from "@/context/global-provider";
import {createUser} from "@/lib/appwrite";

const SignUp = () => {
  const {setUser, setIsLogged} = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    addressline: "",
    thumbnail: null,
  });

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      setForm({
        ...form,
        thumbnail: result.assets[0] as any,
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
    if (
      form.email === "" ||
      form.password === "" ||
      form.email === "" ||
      form.username === "" ||
      form.name === "" ||
      form.city === "" ||
      form.state === "" ||
      form.country === "" ||
      form.zip === "" ||
      form.addressline === "" ||
      !form.thumbnail
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
      const result = await createUser(form);
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
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
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 mt-10 mb-20"
          style={{minHeight: Dimensions.get("window").height - 100}}
        >
          <Image
            source={require("../../assets/icon.png")}
            className="w-20 h-20 rounded-xl"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold my-5">Sign Up</Text>
          <View className="mb-5 space-y-2">
            <Text className="text-base font-bold">User Image</Text>
            <TouchableOpacity onPress={() => openPicker()}>
              {form.thumbnail ? (
                <Image
                  // @ts-ignore
                  source={{uri: form.thumbnail.uri}}
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
          <TextInput
            label="Email"
            value={form.email}
            onChangeText={(text) => setForm({...form, email: text})}
            mode="outlined"
            style={{marginBottom: 5}}
          />
          <TextInput
            label="Password"
            value={form.password}
            onChangeText={(text) => setForm({...form, password: text})}
            mode="outlined"
            style={{marginBottom: 5}}
            right={
              <TextInput.Icon
                icon={secureText ? "eye" : "eye-off"}
                onPress={() => setSecureText(!secureText)}
              />
            }
            secureTextEntry={secureText}
          />
          <TextInput
            label="Name"
            value={form.name}
            onChangeText={(text) => setForm({...form, name: text})}
            mode="outlined"
            style={{marginBottom: 5}}
          />
          <TextInput
            label="Username"
            value={form.username}
            onChangeText={(text) => setForm({...form, username: text})}
            mode="outlined"
            style={{marginBottom: 5}}
          />
          <TextInput
            label="City"
            value={form.city}
            onChangeText={(text) => setForm({...form, city: text})}
            mode="outlined"
            style={{marginBottom: 5}}
          />
          <TextInput
            label="State"
            value={form.state}
            onChangeText={(text) => setForm({...form, state: text})}
            mode="outlined"
            style={{marginBottom: 5}}
          />
          <TextInput
            label="Country"
            value={form.country}
            onChangeText={(text) => setForm({...form, country: text})}
            mode="outlined"
            style={{marginBottom: 5}}
          />
          <TextInput
            label="Zip"
            value={form.zip}
            onChangeText={(text) => setForm({...form, zip: text})}
            mode="outlined"
            style={{marginBottom: 5}}
          />
          <TextInput
            label="Addressline"
            value={form.addressline}
            onChangeText={(text) => setForm({...form, addressline: text})}
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
            Register
          </Button>
          <View className="flex justify-center pt-5 flex-row gap-2 mb-5">
            <Text className="text-lg">Already have an account?</Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-primary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
