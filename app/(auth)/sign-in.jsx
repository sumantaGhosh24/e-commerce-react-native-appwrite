import {useState} from "react";
import {Alert, Dimensions, Image, ScrollView, Text, View} from "react-native";
import {Button, TextInput} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, router} from "expo-router";

import {useGlobalContext} from "../../context/GlobalProvider";
import {getCurrentUser, signIn} from "../../lib/appwrite";

const SignIn = () => {
  const {setUser, setIsLogged} = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      return Alert.alert("Error", "Please fill all the fields.");
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully.");

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
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
            resizeMode="contain"
            className="w-20 h-20 rounded-xl"
          />
          <Text className="text-2xl font-bold my-5">Sign In</Text>
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
            style={{marginBottom: 10}}
            right={
              <TextInput.Icon
                icon={secureText ? "eye" : "eye-off"}
                onPress={() => setSecureText(!secureText)}
              />
            }
            secureTextEntry={secureText}
          />
          <Button
            mode="contained"
            onPress={submit}
            buttonColor="#2563eb"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Login
          </Button>
          <View className="flex justify-center pt-5 flex-row gap-2 mb-5">
            <Text className="text-lg">Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-primary"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
