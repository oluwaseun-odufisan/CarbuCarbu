import { View, TextInput, FlatList, Text, Image } from "react-native";
import { useState } from "react";
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";
import { useLocationStore } from "@/store";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

if (!googlePlacesApiKey) {
  console.error(
    "Google Places API key is missing. Please check your .env file."
  );
} else {
  console.log("Google Places API key loaded:", googlePlacesApiKey);
}

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const { userLocation } = useLocationStore();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    try {
      // Log the query for debugging
      console.log("Search query:", input);

      // Detect international countries
      const isInternational = ["uk", "united kingdom", "germany", "usa"].some(
        (country) => input.toLowerCase().includes(country)
      );

      // Construct API URL
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${googlePlacesApiKey}&language=en`;

      if (!isInternational && userLocation) {
        // Bias to 100km around Lagos, Nigeria, restrict to Nigeria
        url += `&location=${userLocation.latitude},${userLocation.longitude}&radius=100000&components=country:NG`;
      }

      console.log("API URL:", url); // Debug the full URL
      const response = await fetch(url);
      const data = await response.json();
      console.log("API response:", JSON.stringify(data, null, 2));

      if (data.status === "OK") {
        setSuggestions(data.predictions);
        setError(null);
      } else {
        console.error("API error:", data.status, data.error_message);
        setError(`API error: ${data.status} ${data.error_message || ""}`);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch suggestions. Please try again.");
      setSuggestions([]);
    }
  };

  const fetchDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googlePlacesApiKey}&fields=geometry,formatted_address`
      );
      const data = await response.json();
      console.log("Details response:", JSON.stringify(data, null, 2));
      if (data.status === "OK") {
        handlePress({
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
          address: data.result.formatted_address,
        });
      } else {
        console.error("Details error:", data.status, data.error_message);
        setError(`Details error: ${data.status} ${data.error_message || ""}`);
      }
    } catch (error) {
      console.error("Details fetch error:", error);
      setError("Failed to fetch place details. Please try again.");
    }
  };

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      {googlePlacesApiKey ? (
        <View className="flex-1">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              marginHorizontal: 20,
              position: "relative",
              shadowColor: "#d4d4d4",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <View className="justify-center items-center w-6 h-6">
              <Image
                source={icon ? icon : icons.search}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={{
                backgroundColor: textInputBackgroundColor || "white",
                fontSize: 16,
                fontWeight: "600",
                marginTop: 5,
                width: "90%",
                borderRadius: 200,
                padding: 10,
                color: "black",
              }}
              placeholder={initialLocation ?? "Where do you want to go?"}
              placeholderTextColor="gray"
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                fetchSuggestions(text);
              }}
            />
          </View>
          {error && (
            <Text className="text-red-500 text-sm mt-2 mx-5">{error}</Text>
          )}
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <Text
                style={{
                  padding: 10,
                  fontSize: 16,
                  color: "black",
                  backgroundColor: textInputBackgroundColor || "white",
                }}
                onPress={() => fetchDetails(item.place_id)}
              >
                {item.description}
              </Text>
            )}
            style={{
              backgroundColor: textInputBackgroundColor || "white",
              borderRadius: 10,
              marginTop: 5,
              marginHorizontal: 20,
              zIndex: 99,
              maxHeight: 200,
            }}
          />
        </View>
      ) : (
        <Text className="text-red-500">Google Places API key is missing</Text>
      )}
    </View>
  );
};

export default GoogleTextInput;
