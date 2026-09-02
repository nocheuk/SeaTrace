import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Region } from 'react-native-maps';
import { DEFAULT_MAP_CENTER, DEV_REGION } from '@/constants/development';
import { regionToBounds } from '@/utils/mapBounds';

export { regionToBounds };

export function useUserLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
    if (status !== Location.PermissionStatus.GRANTED) {
      setError('Location permission denied');
      return false;
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
    setError(null);
    return true;
  };

  useEffect(() => {
    requestPermission().catch(() => setError('Unable to get location'));
  }, []);

  return { location, permissionStatus, error, requestPermission };
}

export function useMapRegion(userLocation: { latitude: number; longitude: number } | null): Region {
  const center = userLocation ?? DEFAULT_MAP_CENTER;
  return {
    ...center,
    ...DEV_REGION.defaultZoom,
  };
}
