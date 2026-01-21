import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/auth';
import { attendanceApi } from '../../lib/api';
import { Card, Badge } from '../../components';
import { colors, spacing, typography } from '../../lib/theme';

interface Stats {
  present: number;
  absent: number;
  late: number;
  total: number;
}

export default function DashboardScreen() {
  const { student } = useAuth();
  const [stats, setStats] = useState<Stats>({ present: 0, absent: 0, late: 0, total: 0 });
  const [recentRecords, setRecentRecords] = useState<Array<{
    _id: string;
    date: string;
    status: 'present' | 'absent' | 'late';
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await attendanceApi.getHistory(1, 5);
      if (response.success && response.data) {
        setStats(response.data.stats);
        setRecentRecords(response.data.records);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const attendanceRate = stats.total > 0
    ? (((stats.present + stats.late) / stats.total) * 100).toFixed(1)
    : '0';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: 'present' | 'absent' | 'late') => {
    const variants = {
      present: 'success' as const,
      absent: 'danger' as const,
      late: 'warning' as const,
    };
    return variants[status];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{student?.name || 'Student'} 👋</Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentId}>{student?.studentId}</Text>
            <Text style={styles.courseInfo}>
              {student?.course} Year {student?.year}-{student?.section}
            </Text>
          </View>
        </View>

        {/* Attendance Rate Card */}
        <Card variant="elevated" style={styles.rateCard}>
          <View style={styles.rateHeader}>
            <Text style={styles.rateLabel}>Attendance Rate</Text>
            <Badge
              label={parseFloat(attendanceRate) >= 80 ? 'Good' : 'Needs Improvement'}
              variant={parseFloat(attendanceRate) >= 80 ? 'success' : 'warning'}
            />
          </View>
          <Text style={styles.rateValue}>{attendanceRate}%</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(parseFloat(attendanceRate), 100)}%` },
              ]}
            />
          </View>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.success}20` }]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>
            <Text style={styles.statValue}>{stats.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.danger}20` }]}>
              <Text style={styles.statIconText}>✕</Text>
            </View>
            <Text style={styles.statValue}>{stats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.warning}20` }]}>
              <Text style={styles.statIconText}>⏱</Text>
            </View>
            <Text style={styles.statValue}>{stats.late}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </Card>
        </View>

        {/* Recent Attendance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Attendance</Text>
          {isLoading ? (
            <Card>
              <Text style={styles.loadingText}>Loading...</Text>
            </Card>
          ) : recentRecords.length > 0 ? (
            <Card>
              {recentRecords.map((record, index) => (
                <View
                  key={record._id}
                  style={[
                    styles.recordItem,
                    index < recentRecords.length - 1 && styles.recordBorder,
                  ]}
                >
                  <View>
                    <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                  </View>
                  <Badge
                    label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    variant={getStatusBadge(record.status)}
                  />
                </View>
              ))}
            </Card>
          ) : (
            <Card>
              <Text style={styles.emptyText}>No attendance records yet</Text>
            </Card>
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
  },
  studentInfo: {
    alignItems: 'flex-end',
  },
  studentId: {
    ...typography.caption,
    color: colors.primary[500],
    fontWeight: '600',
  },
  courseInfo: {
    ...typography.small,
    color: colors.text.muted,
  },
  rateCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[900],
    borderColor: colors.primary[700],
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rateLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  rateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary[400],
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.slate[800],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIconText: {
    fontSize: 18,
  },
  statValue: {
    ...typography.h2,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.small,
    color: colors.text.muted,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  recordBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recordDate: {
    ...typography.body,
    color: colors.text.primary,
  },
});
