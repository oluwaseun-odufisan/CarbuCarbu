import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  View,
  BackHandler,
} from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Suppress BackHandler to avoid Clerk's internal error
  useEffect(() => {
    const backHandler = () => {
      return false; // Allow default back navigation
    };

    let subscription;
    try {
      if (BackHandler) {
        subscription = BackHandler.addEventListener(
          "hardwareBackPress",
          backHandler
        );
      } else {
        console.warn("BackHandler is not available.");
      }
    } catch (err) {
      console.error("BackHandler setup error:", err);
    }

    return () => {
      try {
        if (subscription?.remove) {
          subscription.remove();
        }
      } catch (err) {
        console.warn("BackHandler cleanup error:", err);
      }
    };
  }, []);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      console.log("Clerk is not loaded yet.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log("Sign-in attempt:", JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors[0]?.longMessage || "An error occurred during sign-in."
      );
    }
  }, [isLoaded, form]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            First time? No wahala{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
