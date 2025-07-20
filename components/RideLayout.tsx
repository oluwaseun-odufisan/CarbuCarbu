import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/Map";
import { icons } from "@/constants";

const RideLayout = ({
  title,
  snapPoints,
  children,
}: {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-primary-100">
        <View className="flex-col h-screen">
          <View className="flex-row items-center justify-start px-5 pt-12 pb-4 bg-primary-100 shadow-md shadow-primary-300">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md shadow-primary-400">
                <Image
                  source={icons.backArrow}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-PlusJakartaSans-SemiBold text-primary-800 ml-4">
              {title || "Go Back"}
            </Text>
          </View>
          <Map />
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={0}
          backgroundStyle={{ backgroundColor: "#FFFFFF", borderRadius: 20 }}
          handleIndicatorStyle={{ backgroundColor: "#6B008F" }}
        >
          {children}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
