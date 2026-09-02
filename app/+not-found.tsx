import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { AppText, ScreenContainer } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <ScreenContainer style={styles.container}>
        <AppText style={styles.title}>Page not found</AppText>
        <Link href="/" style={styles.link}>
          <AppText>Go home</AppText>
        </Link>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '600' },
  link: { marginTop: 16 },
});
