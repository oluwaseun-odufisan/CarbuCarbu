import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons } from "@/constants";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (err: any) {
      console.error("Sign-out error:", JSON.stringify(err, null, 2));
      setError(
        "Failed to sign out. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-primary-100">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8A00C4" />
          <Text className="text-lg font-PlusJakartaSans-Medium text-primary-700 mt-4">
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-PlusJakartaSans-ExtraBold text-primary-700 my-5">
          My Profile
        </Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri:
                user?.externalAccounts[0]?.imageUrl ??
                user?.imageUrl ??
                "https://via.placeholder.com/110",
            }}
            style={{ width: 110, height: 110, borderRadius: 55 }}
            className="border-4 border-primary-300 shadow-md shadow-primary-300"
          />
          <Text className="text-lg font-PlusJakartaSans-SemiBold text-primary-700 mt-3">
            {user?.firstName} {user?.lastName}
          </Text>
        </View>

        <View className="bg-white rounded-xl shadow-md shadow-primary-300 px-5 py-4">
          <InputField
            label="First Name"
            placeholder={user?.firstName || "Not provided"}
            containerStyle="w-full mb-4"
            inputStyle="p-3.5 border border-primary-200 rounded-lg"
            editable={false}
          />
          <InputField
            label="Last Name"
            placeholder={user?.lastName || "Not provided"}
            containerStyle="w-full mb-4"
            inputStyle="p-3.5 border border-primary-200 rounded-lg"
            editable={false}
          />
          <InputField
            label="Email"
            placeholder={
              user?.primaryEmailAddress?.emailAddress || "Not provided"
            }
            containerStyle="w-full mb-4"
            inputStyle="p-3.5 border border-primary-200 rounded-lg"
            editable={false}
          />
          <InputField
            label="Phone"
            placeholder={
              user?.primaryPhoneNumber?.phoneNumber || "Not provided"
            }
            containerStyle="w-full"
            inputStyle="p-3.5 border border-primary-200 rounded-lg"
            editable={false}
          />
        </View>

        {error && (
          <Text className="text-red-500 text-base font-PlusJakartaSans-Medium text-center mt-4">
            {error}
          </Text>
        )}

        <CustomButton
          title="Sign Out"
          onPress={handleSignOut}
          className="bg-primary-500 rounded-xl shadow-md shadow-primary-300 mt-6"
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
