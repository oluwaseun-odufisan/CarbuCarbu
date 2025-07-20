import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout title="Find a Ride">
      <SafeAreaView className="flex-1 bg-primary-100 px-5 py-4">
        <View className="my-5">
          <Text className="text-lg font-PlusJakartaSans-SemiBold text-primary-800 mb-3">
            From
          </Text>
          <GoogleTextInput
            icon={icons.target}
            initialLocation={userAddress || "Current Location"}
            containerStyle="bg-white rounded-xl shadow-md shadow-primary-300 border border-primary-200"
            textInputBackgroundColor="#F5F5F5"
            handlePress={(location) => setUserLocation(location)}
          />
        </View>
        <View className="my-5">
          <Text className="text-lg font-PlusJakartaSans-SemiBold text-primary-800 mb-3">
            To
          </Text>
          <GoogleTextInput
            icon={icons.map}
            initialLocation={destinationAddress || "Enter Destination"}
            containerStyle="bg-white rounded-xl shadow-md shadow-primary-300 border border-primary-200"
            textInputBackgroundColor="transparent"
            handlePress={(location) => setDestinationLocation(location)}
          />
        </View>
        <CustomButton
          title="Find Now"
          onPress={() => router.push("/(root)/confirm-ride")}
          className="mt-6 bg-primary-500 rounded-xl shadow-md shadow-primary-300"
        />
      </SafeAreaView>
    </RideLayout>
  );
};

export default FindRide;
