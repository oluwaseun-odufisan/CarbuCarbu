import { useSignUp } from "@clerk/clerk-expo";
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
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default" as "default" | "pending" | "failed" | "success",
    error: "",
    code: "",
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

  const onSignUpPress = useCallback(async () => {
    if (!isLoaded) {
      console.log("Clerk is not loaded yet.");
      Alert.alert("Error", "Authentication service is not ready.");
      return;
    }

    setIsLoading(true);
    setVerification({ ...verification, error: "", state: "default" });
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage || "Sign-up failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, form, verification]);

  const onPressVerify = useCallback(async () => {
    if (!isLoaded) {
      console.log("Clerk is not loaded yet.");
      Alert.alert("Error", "Authentication service is not ready.");
      return;
    }

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        const name =
          `${form.firstName || "User"} ${form.lastName || ""}`.trim();
        await fetchAPI("/(api)/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage || "Verification failed."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, form, verification]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center min-h-screen bg-gradient-to-b from-primary-200 via-secondary-100 to-white px-5 pt-12">
        <View className="bg-white rounded-2xl shadow-lg border border-primary-300 p-8 w-full max-w-md mb-10 mt-4">
          <Text className="text-4xl text-primary-500 font-JakartaExtraBold text-center">
            Ready When You Are
          </Text>
          <Text className="text-lg text-general-800 font-JakartaMedium text-center mt-2">
            Create your account and ride on your terms
          </Text>
        </View>

        <View className="w-full max-w-md">
          {verification.error && (
            <Text className="text-danger-500 text-base font-JakartaMedium text-center mb-4">
              {verification.error}
            </Text>
          )}
          <InputField
            label="First Name"
            placeholder="Enter your first name"
            icon={icons.person}
            value={form.firstName}
            onChangeText={(value) => setForm({ ...form, firstName: value })}
            className="mb-4 h-19 mt-2"
            editable={!isLoading}
          />
          <InputField
            label="Last Name"
            placeholder="Enter your last name"
            icon={icons.person}
            value={form.lastName}
            onChangeText={(value) => setForm({ ...form, lastName: value })}
            className="mb-4 h-19 mt-2"
            editable={!isLoading}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            className="mb-4 h-19 mt-2"
            editable={!isLoading}
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
            editable={!isLoading}
          />
          {isLoading ? (
            <View className="w-full mt-6 flex-row justify-center items-center">
              <ActivityIndicator size="large" color="#8A00C4" />
              <Text className="ml-2 text-lg text-primary-500 font-JakartaSemiBold">
                Signing Up...
              </Text>
            </View>
          ) : (
            <CustomButton
              title="Sign Up"
              onPress={onSignUpPress}
              className="w-full mt-6"
              disabled={isLoading}
            />
          )}
          <View className="mt-6">
            <OAuth />
          </View>
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-800 font-JakartaMedium mt-8 mb-12"
          >
            Already have an account?{" "}
            <Text className="text-primary-500 font-JakartaSemiBold">
              Sign In
            </Text>
          </Link>
        </View>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] shadow-lg border border-primary-300">
            <Text className="font-JakartaExtraBold text-2xl text-primary-500 text-center mb-2">
              Verify Your Email
            </Text>
            <Text className="font-JakartaMedium text-base text-general-800 text-center mb-5">
              Enter the code sent to {form.email}.
            </Text>
            <InputField
              label="Verification Code"
              icon={icons.lock}
              placeholder="Enter code"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
              className="mb-4 h-19 mt-2"
              editable={!isLoading}
            />
            {verification.error && (
              <Text className="text-danger-500 text-base font-JakartaMedium text-center mt-1">
                {verification.error}
              </Text>
            )}
            {isLoading ? (
              <View className="w-full mt-6 flex-row justify-center items-center">
                <ActivityIndicator size="large" color="#8A00C4" />
                <Text className="ml-2 text-lg text-primary-500 font-JakartaSemiBold">
                  Verifying...
                </Text>
              </View>
            ) : (
              <CustomButton
                title="Verify Email"
                onPress={onPressVerify}
                className="w-full mt-5"
                disabled={isLoading}
              />
            )}
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] shadow-lg border border-primary-300">
            <Text className="text-3xl font-JakartaExtraBold text-primary-500 text-center">
              Success!
            </Text>
            <Text className="text-base font-JakartaMedium text-general-800 text-center mt-2">
              Your account has been created.
            </Text>
            <CustomButton
              title="Go to Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(root)/(tabs)/home");
              }}
              className="w-full mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
