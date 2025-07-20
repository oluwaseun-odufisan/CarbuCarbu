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
  const scale = useSharedValue(focused ? 1.2 : 1);
  const underlineOffset = useSharedValue(focused ? 0 : -8);
  const underlineOpacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.7, { duration: 300 });
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 300 });
    underlineOffset.value = withTiming(focused ? 0 : -8, { duration: 300 });
    underlineOpacity.value = withTiming(focused ? 1 : 0, { duration: 300 });
  }, [focused, opacity, scale, underlineOffset, underlineOpacity]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: underlineOffset.value }],
    opacity: underlineOpacity.value,
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={animatedIconStyle}
        className={`w-10 h-10 items-center mt-2 justify-center rounded-md ${focused ? "bg-primary-600 shadow-md shadow-primary-400" : "bg-primary-300/80"}`}
      >
        <Image
          source={source}
          tintColor="#FFFFFF"
          resizeMode="contain"
          className="w-6 h-6"
        />
      </Animated.View>
      <Animated.View
        style={animatedUnderlineStyle}
        className="h-0.5 w-10 bg-white mt-2 rounded-full shadow-sm shadow-primary-400"
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
          backgroundColor: "rgba(138, 0, 196, 0.2)", // primary-500 with 20% opacity
          marginHorizontal: 8,
          marginBottom: 20,
          height: 72,
          paddingHorizontal: 16,
          paddingVertical: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          position: "absolute",
          borderRadius: 24,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
        },
        headerShown: false,
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
