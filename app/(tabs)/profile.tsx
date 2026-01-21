import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { Button, Card } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../lib/theme';

export default function ProfileScreen() {
  const { student, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const profileInfo = [
    { label: 'Student ID', value: student?.studentId || '-' },
    { label: 'Email', value: student?.email || '-' },
    { label: 'Course', value: student?.course || '-' },
    { label: 'Year', value: student?.year?.toString() || '-' },
    { label: 'Section', value: student?.section || '-' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {student?.name?.charAt(0).toUpperCase() || 'S'}
            </Text>
          </View>
          <Text style={styles.name}>{student?.name || 'Student'}</Text>
          <Text style={styles.courseLabel}>
            {student?.course} - Year {student?.year} {student?.section}
          </Text>
        </View>

        {/* Profile Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Student Information</Text>
          {profileInfo.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.infoRow,
                index < profileInfo.length - 1 && styles.infoBorder,
              ]}
            >
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </Card>

        {/* App Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>About App</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>SAMS Student</Text>
          </View>
          <View style={[styles.infoRow, styles.infoBorder]}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>SAMS Team</Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          size="lg"
          style={styles.logoutButton}
        />

        {/* Footer */}
        <Text style={styles.footerText}>
          Student Attendance Management System
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  courseLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
