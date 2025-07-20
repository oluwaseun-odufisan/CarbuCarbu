import { useUser, useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";

const Home = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const {
    data: recentRides,
    loading,
    error: fetchError,
  } = useFetch<Ride[]>(
    isSignedIn && user?.id ? `/(api)/ride/${user.id}` : null
  );

  const fetchLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        setLocationError(
          "Location services are disabled. Please enable them in your device settings."
        );
        setHasPermission(false);
        setIsLoadingLocation(false);
        return;
      }

      let { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        if (!canAskAgain) {
          setLocationError(
            "Location permission denied. Please enable it in your device settings."
          );
        } else {
          setLocationError(
            "Location permission denied. Please allow access to continue."
          );
        }
        setIsLoadingLocation(false);
        return;
      }

      setHasPermission(true);

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const formattedAddress = address[0]
        ? `${address[0].name || address[0].street || "Unknown"}, ${address[0].region || "Unknown"}`
        : "Unknown location";

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: formattedAddress,
      });
    } catch (err: any) {
      setLocationError("Failed to fetch location. Please try again.");
      setHasPermission(false);
    }
    setIsLoadingLocation(false);
  }, [setUserLocation]);

  useEffect(() => {
    fetchLocation();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        fetchLocation();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fetchLocation]);

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (err) {
      setLocationError(
        "Failed to open device settings. Please enable location manually."
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  if (!isSignedIn || !user) {
    return (
      <SafeAreaView className="flex-1 bg-primary-100">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-lg font-PlusJakartaSans-SemiBold text-primary-800 text-center">
            Please sign in to continue
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.ride_id.toString()}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center py-5">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-32 h-32"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm font-PlusJakartaSans-Medium text-primary-600">
                  {fetchError || "No recent rides found"}
                </Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#6B008F" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="my-5">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-2xl font-PlusJakartaSans-ExtraBold text-primary-800">
                Welcome {user.firstName || user.emailAddress || "User"} 👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="w-10 h-10 rounded-full bg-white shadow-md shadow-primary-300 items-center justify-center"
              >
                <Image source={icons.out} className="w-5 h-5" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white rounded-xl shadow-md shadow-primary-300"
              textInputBackgroundColor="#F5F5F5"
              handlePress={handleDestinationPress}
            />

            <Text className="text-xl font-PlusJakartaSans-Bold text-primary-800 mt-6 mb-3">
              Your Current Location
            </Text>
            <View className="h-[320px] rounded-xl overflow-hidden shadow-md shadow-primary-300">
              {hasPermission === null || isLoadingLocation ? (
                <View className="flex-1 items-center justify-center bg-white">
                  <ActivityIndicator size="large" color="#6B008F" />
                </View>
              ) : hasPermission === false ? (
                <View className="flex-1 items-center justify-center bg-white p-5">
                  <Text className="text-base font-PlusJakartaSans-Medium text-primary-800 text-center">
                    {locationError || "Unable to load location"}
                  </Text>
                  <TouchableOpacity
                    onPress={handleOpenSettings}
                    className="mt-4 bg-primary-500 px-5 py-3 rounded-lg shadow-md shadow-primary-300"
                  >
                    <Text className="text-white font-PlusJakartaSans-SemiBold">
                      Open Settings
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Map />
              )}
            </View>

            <Text className="text-xl font-PlusJakartaSans-Bold text-primary-800 mt-6 mb-3">
              Recent Rides
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
