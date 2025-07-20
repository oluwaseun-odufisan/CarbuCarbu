import { useOAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";
import { router } from "expo-router";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleOAuth(startOAuthFlow);
      if (result.success) {
        // Delay navigation to ensure RootLayout is mounted
        setTimeout(() => {
          router.replace("/(root)/(tabs)/home");
        }, 100);
      } else {
        console.error("Google OAuth error:", result.message);
      }
    } catch (err) {
      console.error("Unexpected OAuth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Continue with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
        disabled={loading}
        IconRight={() =>
          loading ? (
            <ActivityIndicator size="small" color="#6B008F" className="ml-2" />
          ) : null
        }
      />
    </View>
  );
};

export default OAuth;
