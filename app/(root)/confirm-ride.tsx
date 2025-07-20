import { router } from "expo-router";
import { View } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriverStore } from "@/store";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

  return (
    <RideLayout title="Choose a Rider" snapPoints={["65%", "85%"]}>
      <View className="flex-1 bg-primary-100 px-5">
        <BottomSheetFlatList
          data={drivers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <DriverCard
              item={item}
              selected={selectedDriver!}
              setSelected={() => setSelectedDriver(item.id!)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={() => (
            <View className="px-5 py-4">
              <CustomButton
                title="Select Ride"
                onPress={() => router.push("/(root)/book-ride")}
                className="bg-primary-500 rounded-xl shadow-md shadow-primary-300"
              />
            </View>
          )}
        />
      </View>
    </RideLayout>
  );
};

export default ConfirmRide;
