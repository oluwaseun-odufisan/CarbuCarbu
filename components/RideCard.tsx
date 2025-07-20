import { Image, Text, View } from "react-native";

import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";

const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <View className="bg-white rounded-xl shadow-md shadow-primary-300 mb-4 p-4">
      <View className="flex-row items-center justify-between">
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
          }}
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <View className="flex-row items-center mb-2">
            <Image source={icons.to} className="w-5 h-5" />
            <Text
              className="text-base font-PlusJakartaSans-Medium text-primary-800 ml-2"
              numberOfLines={1}
            >
              {ride.origin_address}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Image source={icons.point} className="w-5 h-5" />
            <Text
              className="text-base font-PlusJakartaSans-Medium text-primary-800 ml-2"
              numberOfLines={1}
            >
              {ride.destination_address}
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-4 bg-primary-100 rounded-lg p-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
            Date & Time
          </Text>
          <Text
            className="text-sm font-PlusJakartaSans-SemiBold text-primary-800"
            numberOfLines={1}
          >
            {formatDate(ride.created_at)}, {formatTime(ride.ride_time)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
            Driver
          </Text>
          <Text className="text-sm font-PlusJakartaSans-SemiBold text-primary-800">
            {ride.driver.first_name} {ride.driver.last_name}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
            Car Seats
          </Text>
          <Text className="text-sm font-PlusJakartaSans-SemiBold text-primary-800">
            {ride.driver.car_seats}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
            Payment Status
          </Text>
          <Text
            className={`text-sm font-PlusJakartaSans-SemiBold ${
              ride.payment_status === "paid" ? "text-green-500" : "text-red-500"
            }`}
          >
            {ride.payment_status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideCard;
