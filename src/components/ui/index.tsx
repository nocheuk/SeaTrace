import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

type ButtonProps = Omit<React.ComponentProps<typeof Pressable>, 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = 'primary',
  loading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const bg =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'secondary'
        ? theme.colors.surfaceSecondary
        : variant === 'danger'
          ? theme.colors.critical
          : 'transparent';

  const color =
    variant === 'primary' || variant === 'danger'
      ? theme.colors.textInverse
      : theme.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.button,
          {
            backgroundColor: bg,
            opacity: pressed || disabled ? 0.85 : 1,
            borderColor: variant === 'ghost' ? theme.colors.border : 'transparent',
            borderWidth: variant === 'ghost' ? 1 : 0,
          },
          style,
        ])
      }
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text style={[styles.buttonText, { color }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function AppText({ style, ...props }: TextProps) {
  const { theme } = useTheme();
  return <Text style={[{ color: theme.colors.text }, style]} {...props} />;
}

export function Card({ style, ...props }: ViewProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        theme.shadows.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        style,
      ]}
      {...props}
    />
  );
}

export function ScreenContainer({ style, ...props }: ViewProps) {
  const { theme } = useTheme();
  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background }, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
});
