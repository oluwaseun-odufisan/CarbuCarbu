import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";

const DriverCard = ({
  item,
  selected,
  setSelected,
  containerStyle,
}: DriverCardProps) => {
  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`flex-row items-center justify-between py-4 px-4 rounded-xl shadow-md shadow-primary-300 ${
        selected === item.id ? "bg-primary-200" : "bg-white"
      } ${containerStyle}`}
    >
      <Image
        source={{ uri: item.profile_image_url }}
        className="w-16 h-16 rounded-full border-2 border-primary-300"
        resizeMode="cover"
      />
      <View className="flex-1 mx-4">
        <View className="flex-row items-center mb-2">
          <Text className="text-lg font-PlusJakartaSans-SemiBold text-primary-800">
            {item.title}
          </Text>
          <View className="flex-row items-center ml-2 space-x-1">
            <Image source={icons.star} className="w-4 h-4" />
            <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
              {item.rating || 4}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <View className="flex-row items-center">
            <Image source={icons.dollar} className="w-4 h-4" />
            <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600 ml-1">
              ${item.price}
            </Text>
          </View>
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600 mx-2">
            |
          </Text>
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
            {formatTime(item.time!)}
          </Text>
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600 mx-2">
            |
          </Text>
          <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
            {item.car_seats} seats
          </Text>
        </View>
      </View>
      <Image
        source={{ uri: item.car_image_url }}
        className="w-16 h-16"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default DriverCard;
