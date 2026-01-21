import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../lib/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function Badge({
  label,
  variant = 'default',
  size = 'md',
  style,
}: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], styles[`${size}Size`], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  success: {
    backgroundColor: `${colors.success}20`,
    borderColor: `${colors.success}40`,
  },
  warning: {
    backgroundColor: `${colors.warning}20`,
    borderColor: `${colors.warning}40`,
  },
  danger: {
    backgroundColor: `${colors.danger}20`,
    borderColor: `${colors.danger}40`,
  },
  info: {
    backgroundColor: `${colors.info}20`,
    borderColor: `${colors.info}40`,
  },
  default: {
    backgroundColor: `${colors.slate[500]}20`,
    borderColor: `${colors.slate[500]}40`,
  },
  smSize: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  mdSize: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontWeight: '500',
  },
  successText: {
    color: colors.success,
  },
  warningText: {
    color: colors.warning,
  },
  dangerText: {
    color: colors.danger,
  },
  infoText: {
    color: colors.info,
  },
  defaultText: {
    color: colors.text.secondary,
  },
  smText: {
    fontSize: 10,
  },
  mdText: {
    fontSize: 12,
  },
});
