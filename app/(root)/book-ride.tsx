import { useUser } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Image, Text, View } from "react-native";

import Payment from "@/components/Payment";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver
  )[0];

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.uber"
      urlScheme="myapp"
    >
      <RideLayout title="Book Ride" snapPoints={["65%", "85%"]}>
        <View className="flex-1 bg-primary-100 px-5 py-4">
          <Text className="text-xl font-PlusJakartaSans-Bold text-primary-800 mb-4">
            Trip Details
          </Text>

          <View className="items-center justify-center mt-6">
            <Image
              source={{ uri: driverDetails?.profile_image_url }}
              className="w-24 h-24 rounded-full border-2 border-primary-300 shadow-md shadow-primary-400"
              resizeMode="cover"
            />
            <View className="flex-row items-center justify-center mt-4 space-x-2">
              <Text className="text-lg font-PlusJakartaSans-SemiBold text-primary-800">
                {driverDetails?.title}
              </Text>
              <View className="flex-row items-center space-x-1">
                <Image
                  source={icons.star}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-PlusJakartaSans-Medium text-primary-600">
                  {driverDetails?.rating}
                </Text>
              </View>
            </View>
          </View>

          <View className="w-full rounded-xl bg-white mt-6 px-5 py-4 shadow-md shadow-primary-300">
            <View className="flex-row items-center justify-between py-3 border-b border-primary-200">
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-800">
                Fare
              </Text>
              <Text className="text-base font-PlusJakartaSans-SemiBold text-green-500">
                ${driverDetails?.price}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-3 border-b border-primary-200">
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-800">
                Pickup Time
              </Text>
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-600">
                {formatTime(driverDetails?.time!)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-3">
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-800">
                Available Seats
              </Text>
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-600">
                {driverDetails?.car_seats}
              </Text>
            </View>
          </View>

          <View className="w-full mt-6">
            <View className="flex-row items-center py-3 border-t border-b border-primary-200">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-800 ml-3">
                {userAddress}
              </Text>
            </View>
            <View className="flex-row items-center py-3 border-b border-primary-200">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-800 ml-3">
                {destinationAddress}
              </Text>
            </View>
          </View>

          <Payment
            fullName={user?.fullName!}
            email={user?.emailAddresses[0].emailAddress!}
            amount={driverDetails?.price!}
            driverId={driverDetails?.id}
            rideTime={driverDetails?.time!}
          />
        </View>
      </RideLayout>
    </StripeProvider>
  );
};

export default BookRide;
