import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { COPY } from '@/constants/copy';
import { useTheme } from '@/theme';

const ONBOARDING_KEY = '@seatrace/onboarding_complete';

const slides = [
  COPY.onboarding.slide1,
  COPY.onboarding.slide2,
  COPY.onboarding.slide3,
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const width = Dimensions.get('window').width;

  const complete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/auth/sign-in');
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  return (
    <ScreenContainer style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceSecondary }]}>
              <AppText style={styles.icon}>🌊</AppText>
            </View>
            <AppText style={styles.title}>{item.title}</AppText>
            <AppText style={[styles.body, { color: theme.colors.textSecondary }]}>{item.body}</AppText>
          </View>
        )}
      />

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? theme.colors.primary : theme.colors.border,
                width: i === index ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        {index < slides.length - 1 ? (
          <>
            <Button title={COPY.onboarding.skip} variant="ghost" onPress={complete} />
            <Button
              title={COPY.onboarding.next}
              onPress={() => listRef.current?.scrollToIndex({ index: index + 1 })}
            />
          </>
        ) : (
          <Button title={COPY.onboarding.getStarted} onPress={complete} />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32 },
  slide: { paddingHorizontal: 32, paddingTop: 80, alignItems: 'center' },
  iconCircle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  icon: { fontSize: 40 },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  body: { fontSize: 17, textAlign: 'center', lineHeight: 26 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 24 },
  dot: { height: 8, borderRadius: 4 },
  actions: { paddingHorizontal: 24, gap: 12 },
});
