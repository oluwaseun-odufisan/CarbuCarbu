import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  if (!userLatitude || !userLongitude) {
    console.warn("Invalid user coordinates for marker generation:", {
      userLatitude,
      userLongitude,
    });
    return [];
  }
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name || ""}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    console.warn("User location missing, using default region");
    return {
      latitude: 6.600472, // Default to Lagos
      longitude: 3.347223,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3 || 0.01;
  const longitudeDelta = (maxLng - minLng) * 1.3 || 0.01;

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude ||
    !directionsAPI
  ) {
    console.error("Missing required coordinates or API key:", {
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude,
      hasApiKey: !!directionsAPI,
    });
    return markers.map((marker) => ({ ...marker, time: 0, price: "0.00" }));
  }

  try {
    const timesPromises = markers.map(async (marker) => {
      const responseToUser = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
      );
      const dataToUser = await responseToUser.json();
      console.log(`Directions to user for marker ${marker.id}:`, {
        status: dataToUser.status,
        error: dataToUser.error_message,
      });
      if (dataToUser.status !== "OK") {
        console.error(
          `Directions to user error for marker ${marker.id}:`,
          dataToUser.status,
          dataToUser.error_message
        );
        return { ...marker, time: 0, price: "0.00", distance: 0 };
      }
      const timeToUser = dataToUser.routes[0].legs[0].duration.value;
      const distanceToUser = dataToUser.routes[0].legs[0].distance.value;

      const responseToDestination = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
      );
      const dataToDestination = await responseToDestination.json();
      console.log(`Directions to destination for marker ${marker.id}:`, {
        status: dataToDestination.status,
        error: dataToDestination.error_message,
      });
      if (dataToDestination.status !== "OK") {
        console.error(
          `Directions to destination error for marker ${marker.id}:`,
          dataToDestination.status,
          dataToDestination.error_message
        );
        return { ...marker, time: 0, price: "0.00", distance: 0 };
      }
      const timeToDestination = dataToDestination.routes[0].legs[0].duration.value;
      const distanceToDestination = dataToDestination.routes[0].legs[0].distance.value;

      const totalTime = (timeToUser + timeToDestination) / 60;
      const totalDistance = distanceToUser + distanceToDestination;
      const price = (totalTime * 0.5).toFixed(2);

      return { ...marker, time: totalTime, price, distance: totalDistance };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
    return markers.map((marker) => ({ ...marker, time: 0, price: "0.00", distance: 0 }));
  }
};