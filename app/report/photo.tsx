import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { analytics } from '@/features/analytics';
import { compressImage } from '@/services/imageProcessing';
import { useReportFlowStore } from '@/stores/reportFlowStore';
import { useTheme } from '@/theme';

export default function PhotoStep() {
  const { theme } = useTheme();
  const photoUri = useReportFlowStore((s) => s.photoUri);
  const setPhoto = useReportFlowStore((s) => s.setPhoto);
  const [loading, setLoading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', COPY.errors.permissionDenied);
      return;
    }

    setLoading(true);
    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.9, allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.9, allowsEditing: true });

      if (!result.canceled && result.assets[0]) {
        const compressed = await compressImage(result.assets[0].uri);
        setPhoto(compressed.uri);
        analytics.track('photo_added');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <AppText style={styles.title}>{COPY.report.photoStep}</AppText>
      <AppText style={[styles.notice, { color: theme.colors.textSecondary }]}>
        {COPY.report.safetyNotice}
      </AppText>

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} accessibilityLabel="Selected photo" />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <AppText style={{ color: theme.colors.textSecondary }}>No photo selected</AppText>
        </View>
      )}

      <View style={styles.actions}>
        <Button title="Take photo" loading={loading} onPress={() => pickImage(true)} />
        <Button title="Choose from library" variant="secondary" loading={loading} onPress={() => pickImage(false)} />
        <Button
          title="Continue"
          variant="primary"
          disabled={!photoUri}
          onPress={() => router.push('/report/location')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  notice: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  preview: { width: '100%', height: 280, borderRadius: 16, marginBottom: 20 },
  placeholder: { width: '100%', height: 280, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  actions: { gap: 12 },
});
