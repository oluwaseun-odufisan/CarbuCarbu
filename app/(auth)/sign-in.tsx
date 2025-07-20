import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
  BackHandler,
  NativeEventSubscription,
} from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons } from "@/constants";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Suppress BackHandler to avoid Clerk's internal error
  useEffect(() => {
    const backHandler = () => {
      return false; // Allow default back navigation
    };

    let subscription: NativeEventSubscription | undefined;
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

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // Only log non-critical states without showing an alert
        console.log("Sign-in attempt:", JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage || "An error occurred during sign-in."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, form]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center min-h-screen bg-gradient-to-b from-primary-200 via-secondary-100 to-white px-5 pt-12">
        <View className="bg-white rounded-2xl shadow-lg border border-primary-300 p-8 w-full max-w-md mb-10 mt-4">
          <Text className="text-4xl text-primary-500 font-JakartaExtraBold text-center">
            Your Ride Awaits
          </Text>
          <Text className="text-lg text-general-800 font-JakartaMedium text-center mt-2">
            Sign in to get moving
          </Text>
        </View>

        <View className="w-full max-w-md">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            className="mb-4 h-19 mt-2"
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            className="mb-4 h-19 mt-2"
          />

          {isLoading ? (
            <View className="w-full mt-6 flex-row justify-center items-center">
              <ActivityIndicator size="large" color="#8A00C4" />
              <Text className="ml-2 text-lg text-primary-500 font-JakartaSemiBold">
                Signing In...
              </Text>
            </View>
          ) : (
            <CustomButton
              title="Sign In"
              onPress={onSignInPress}
              className="w-full mt-6"
            />
          )}

          <View className="mt-6">
            <OAuth />
          </View>

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-800 font-JakartaMedium mt-8 mb-12"
          >
            First time? Join now{" "}
            <Text className="text-primary-500 font-JakartaSemiBold">
              Sign Up
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
