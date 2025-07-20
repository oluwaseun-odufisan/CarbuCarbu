import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { icons } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => {
  const opacity = useSharedValue(focused ? 1 : 0.7);
  const underlineOffset = useSharedValue(focused ? 0 : -8);
  const underlineOpacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.7, { duration: 300 });
    underlineOffset.value = withTiming(focused ? 0 : -8, { duration: 300 });
    underlineOpacity.value = withTiming(focused ? 1 : 0, { duration: 300 });
  }, [focused, opacity, underlineOffset, underlineOpacity]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: underlineOffset.value }],
    opacity: underlineOpacity.value,
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={animatedIconStyle}
        className={`w-10 h-10 items-center justify-center rounded-md ${focused ? "bg-primary-600 shadow-md shadow-primary-400" : "bg-primary-300"}`}
      >
        <Image
          source={source}
          tintColor="#FFFFFF"
          resizeMode="contain"
          className="w-5 h-5"
        />
      </Animated.View>
      <Animated.View
        style={animatedUnderlineStyle}
        className="h-0.5 w-8 bg-white mt-2 rounded-full shadow-sm shadow-primary-400"
      />
    </View>
  );
};

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#E6CCFF",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#8A00C4", // primary-500
          marginHorizontal: 16,
          marginBottom: 20,
          height: 68,
          paddingHorizontal: 12,
          paddingVertical: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          position: "absolute",
          borderRadius: 20,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 12,
        },
        headerShown: false, // Disable header to remove back button
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
