import { Stack } from 'expo-router';

export default function ReportLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ title: 'New Report', headerShown: false }} />
      <Stack.Screen name="photo" options={{ title: 'Photo' }} />
      <Stack.Screen name="location" options={{ title: 'Location' }} />
      <Stack.Screen name="category" options={{ title: 'Category' }} />
      <Stack.Screen name="details" options={{ title: 'Details' }} />
      <Stack.Screen name="review" options={{ title: 'Review' }} />
      <Stack.Screen name="success" options={{ title: 'Submitted', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Report' }} />
    </Stack>
  );
}
