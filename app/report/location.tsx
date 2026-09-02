import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { DEFAULT_MAP_CENTER } from '@/constants/development';
import { useReportFlowStore } from '@/stores/reportFlowStore';
import { useTheme } from '@/theme';

export default function LocationStep() {
  const { theme } = useTheme();
  const { latitude, longitude, setLocation } = useReportFlowStore();
  const [region, setRegion] = useState<Region>({
    ...DEFAULT_MAP_CENTER,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [pin, setPin] = useState<{ latitude: number; longitude: number }>(DEFAULT_MAP_CENTER);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert('Location', COPY.errors.locationFailed);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setPin(coords);
      setRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      setAccuracy(pos.coords.accuracy ?? null);
    })();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      setPin({ latitude, longitude });
    }
  }, [latitude, longitude]);

  const onContinue = () => {
    setLocation(pin.latitude, pin.longitude, accuracy, new Date().toISOString());
    router.push('/report/category');
  };

  return (
    <ScreenContainer style={styles.container}>
      <AppText style={styles.title}>{COPY.report.locationStep}</AppText>
      <AppText style={{ color: theme.colors.textSecondary, marginBottom: 12 }}>
        Drag the pin if GPS is inaccurate
      </AppText>

      <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        <Marker
          coordinate={pin}
          draggable
          onDragEnd={(e) => setPin(e.nativeEvent.coordinate)}
          pinColor={theme.colors.accent}
        />
      </MapView>

      <View style={styles.actions}>
        <Button title="Continue" onPress={onContinue} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  map: { flex: 1, borderRadius: 16, marginBottom: 16 },
  actions: { paddingBottom: 16 },
});
