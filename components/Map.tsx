import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { usePathname } from "expo-router";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const Map = () => {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const pathname = usePathname();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!directionsAPI) {
      console.error("Directions API key is missing");
      setRouteError("Map configuration error. Please contact support.");
      return;
    }
    if (Array.isArray(drivers) && userLatitude && userLongitude) {
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    } else {
      console.warn("Missing drivers or user location:", {
        drivers: Array.isArray(drivers),
        userLatitude,
        userLongitude,
      });
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude != null &&
      destinationLongitude != null &&
      userLatitude != null &&
      userLongitude != null
    ) {
      console.log("Calculating driver times with:", {
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
        markersCount: markers.length,
      });
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      })
        .then((drivers) => {
          setDrivers(drivers as MarkerData[]);
          if (drivers.length > 0 && drivers[0].time) {
            setRouteInfo({
              distance: `${(drivers[0].distance / 1000 || 0).toFixed(1)} km`,
              duration: `${Math.ceil(drivers[0].time / 60 || 0)} min`,
            });
          } else {
            setRouteError("Unable to calculate route. Please try again.");
          }
        })
        .catch((err) => {
          console.error("Error in calculateDriverTimes:", err);
          setRouteError("Failed to calculate driver times. Please try again.");
        });
      // Fit map to route
      if (mapRef.current && destinationLatitude && destinationLongitude) {
        mapRef.current.fitToCoordinates(
          [
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: destinationLatitude, longitude: destinationLongitude },
          ],
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          }
        );
      }
    } else {
      console.warn("Skipping driver times calculation:", {
        markers: markers.length,
        destinationLatitude,
        destinationLongitude,
        userLatitude,
        userLongitude,
      });
      setRouteInfo(null);
      setRouteError(null);
      // Reset map to user location
      if (mapRef.current && userLatitude && userLongitude) {
        mapRef.current.animateToRegion({
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }
  }, [
    markers,
    destinationLatitude,
    destinationLongitude,
    userLatitude,
    userLongitude,
    setDrivers,
  ]);

  const region: Region | undefined = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  if (loading || userLatitude == null || userLongitude == null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6B008F" />
        <Text className="text-base font-PlusJakartaSans-Medium text-primary-800 mt-2">
          Loading map...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base font-PlusJakartaSans-Medium text-primary-800">
          Error: {error}
        </Text>
      </View>
    );
  }

  const isFindRide = pathname.includes("/find-ride");

  return (
    <View className="flex-1 relative">
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        className="w-full h-full rounded-xl"
        tintColor="#6B008F"
        mapType="mutedStandard"
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}
        userInterfaceStyle="light"
        customMapStyle={[
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#F5E6FF" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#8A00C4" }],
          },
        ]}
      >
        {markers.length > 0 &&
          markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              image={
                selectedDriver === +marker.id
                  ? icons.selectedMarker
                  : icons.marker
              }
            />
          ))}
        {destinationLatitude != null &&
          destinationLongitude != null &&
          userLatitude != null &&
          userLongitude != null && (
            <>
              <Marker
                key="destination"
                coordinate={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude,
                }}
                title="Destination"
                image={icons.pin}
              />
              <MapViewDirections
                origin={{
                  latitude: userLatitude,
                  longitude: userLongitude,
                }}
                destination={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude,
                }}
                apikey={directionsAPI!}
                strokeColor="#6B008F"
                strokeWidth={6}
                lineDashPattern={[0, 0]}
                onReady={(result) => {
                  if (result.status === "ZERO_RESULTS") {
                    setRouteError(
                      "No route found. Please select a different destination."
                    );
                    setRouteInfo(null);
                    return;
                  }
                  setRouteError(null);
                  setRouteInfo({
                    distance: `${result.distance.toFixed(1)} km`,
                    duration: `${Math.ceil(result.duration)} min`,
                  });
                  if (mapRef.current) {
                    mapRef.current.fitToCoordinates(
                      [
                        { latitude: userLatitude, longitude: userLongitude },
                        {
                          latitude: destinationLatitude,
                          longitude: destinationLongitude,
                        },
                      ],
                      {
                        edgePadding: {
                          top: 50,
                          right: 50,
                          bottom: 50,
                          left: 50,
                        },
                        animated: true,
                      }
                    );
                  }
                }}
                onError={(error) => {
                  console.error("MapViewDirections error:", error);
                  setRouteError("Failed to load route. Please try again.");
                  setRouteInfo(null);
                }}
              />
            </>
          )}
      </MapView>
      {isFindRide &&
        routeInfo &&
        destinationLatitude != null &&
        destinationLongitude != null &&
        !routeError && (
          <View className="absolute top-4 left-4 right-4 bg-white rounded-xl p-4 shadow-md shadow-primary-300 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Text className="text-base font-PlusJakartaSans-SemiBold text-primary-800 mr-2">
                Distance:
              </Text>
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-600">
                {routeInfo.distance}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-base font-PlusJakartaSans-SemiBold text-primary-800 mr-2">
                Time:
              </Text>
              <Text className="text-base font-PlusJakartaSans-Medium text-primary-600">
                {routeInfo.duration}
              </Text>
            </View>
          </View>
        )}
      {routeError && isFindRide && (
        <View className="absolute top-4 left-4 right-4 bg-white rounded-xl p-4 shadow-md shadow-primary-300">
          <Text className="text-base font-PlusJakartaSans-Medium text-red-500">
            {routeError}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Map;
