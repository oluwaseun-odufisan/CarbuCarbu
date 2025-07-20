import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

// Custom hook to safely initialize useSignUp
const useSafeSignUp = () => {
  const signUpHook = useSignUp();
  const { isLoaded, signUp, setActive } = signUpHook;

  useEffect(() => {
    console.log("useSignUp initialized, isLoaded:", isLoaded);
    // Mock BackHandler.removeEventListener if undefined
    if (!BackHandler.removeEventListener) {
      BackHandler.removeEventListener = (
        event: string,
        callback: () => void
      ) => {
        console.log("Mock removeEventListener called for:", event);
      };
    }
    return () => {
      // Cleanup mock if necessary
    };
  }, []);

  return { isLoaded, signUp, setActive };
};

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSafeSignUp();
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
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      setVerification({
        ...verification,
        error: "Authentication service is not ready.",
        state: "failed",
      });
      return;
    }
    setLoading(true);
    setVerification({ ...verification, error: "", state: "default" });
    try {
      console.log("Attempting sign-up with:", {
        email: form.email,
        password: form.password,
      });
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
      setVerification({
        ...verification,
        error:
          err.errors?.[0]?.longMessage || "Sign-up failed. Please try again.",
        state: "failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      setVerification({
        ...verification,
        error: "Authentication service is not ready.",
        state: "failed",
      });
      return;
    }
    setLoading(true);
    try {
      console.log("Attempting verification with code:", verification.code);
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
      setVerification({
        ...verification,
        error: err.errors?.[0]?.longMessage || "Verification failed.",
        state: "failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-primary-100">
      <View className="flex-1">
        <View className="relative w-full h-[250px]">
          <Image
            source={images.signUpCar}
            className="w-full h-full"
            resizeMode="cover"
          />
          <Text className="text-3xl font-PlusJakartaSans-ExtraBold text-white absolute bottom-6 left-6">
            Create Account
          </Text>
        </View>
        <View className="p-6">
          {verification.error && (
            <Text className="text-danger-500 text-base font-PlusJakartaSans-Medium text-center mb-4">
              {verification.error}
            </Text>
          )}
          <InputField
            label="First Name"
            placeholder="Enter your first name"
            icon={icons.person}
            value={form.firstName}
            onChangeText={(value) => setForm({ ...form, firstName: value })}
            containerStyle="mb-4"
            editable={!loading}
          />
          <InputField
            label="Last Name"
            placeholder="Enter your last name"
            icon={icons.person}
            value={form.lastName}
            onChangeText={(value) => setForm({ ...form, lastName: value })}
            containerStyle="mb-4"
            editable={!loading}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            containerStyle="mb-4"
            editable={!loading}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            containerStyle="mb-6"
            editable={!loading}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="bg-primary-500 rounded-xl shadow-md shadow-primary-300"
            disabled={loading}
            IconRight={() =>
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                  className="ml-2"
                />
              ) : null
            }
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-base font-PlusJakartaSans-Medium text-primary-700 text-center mt-8"
          >
            Already have an account?{" "}
            <Text className="text-secondary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] shadow-md shadow-primary-300">
            <Text className="font-PlusJakartaSans-ExtraBold text-2xl text-primary-800 mb-2">
              Verify Email
            </Text>
            <Text className="font-PlusJakartaSans-Medium text-base text-primary-700 mb-5">
              Enter the code sent to {form.email}.
            </Text>
            <InputField
              label="Verification Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
              containerStyle="mb-4"
              editable={!loading}
            />
            {verification.error && (
              <Text className="text-danger-500 text-sm font-PlusJakartaSans-Medium mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500 rounded-xl shadow-md shadow-primary-300"
              disabled={loading}
              IconRight={() =>
                loading ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                    className="ml-2"
                  />
                ) : null
              }
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] shadow-md shadow-primary-300">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-PlusJakartaSans-Bold text-primary-800 text-center">
              Success!
            </Text>
            <Text className="text-base font-PlusJakartaSans-Medium text-primary-700 text-center mt-2">
              Your account is verified.
            </Text>
            <CustomButton
              title="Go to Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(root)/(tabs)/home");
              }}
              className="mt-5 bg-primary-500 rounded-xl shadow-md shadow-primary-300"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
