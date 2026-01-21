import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { attendanceApi } from '../../lib/api';
import { Card, Badge } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../lib/theme';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AttendanceScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchRecords = useCallback(async (page: number, refresh = false) => {
    try {
      const response = await attendanceApi.getHistory(page, 20);
      if (response.success && response.data) {
        if (refresh || page === 1) {
          setRecords(response.data.records);
        } else {
          setRecords((prev) => [...prev, ...response.data!.records]);
        }
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords(1);
  }, [fetchRecords]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecords(1, true);
  };

  const loadMore = () => {
    if (!loadingMore && pagination.page < pagination.pages) {
      setLoadingMore(true);
      fetchRecords(pagination.page + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  };

  const getStatusStyles = (status: 'present' | 'absent' | 'late') => {
    const styles = {
      present: {
        bg: `${colors.success}20`,
        border: colors.success,
        icon: '✓',
      },
      absent: {
        bg: `${colors.danger}20`,
        border: colors.danger,
        icon: '✕',
      },
      late: {
        bg: `${colors.warning}20`,
        border: colors.warning,
        icon: '⏱',
      },
    };
    return styles[status];
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => {
    const { day, date } = formatDate(item.date);
    const statusStyle = getStatusStyles(item.status);

    return (
      <Card style={styles.recordCard}>
        <View style={styles.recordContent}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
            ]}
          >
            <Text style={styles.statusIcon}>{statusStyle.icon}</Text>
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordDay}>{day}</Text>
            <Text style={styles.recordDate}>{date}</Text>
            {item.remarks && (
              <Text style={styles.recordRemarks}>{item.remarks}</Text>
            )}
          </View>
          <Badge
            label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            variant={
              item.status === 'present'
                ? 'success'
                : item.status === 'absent'
                ? 'danger'
                : 'warning'
            }
          />
        </View>
      </Card>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No Attendance Records</Text>
        <Text style={styles.emptyText}>
          Your attendance history will appear here once your teacher marks it.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Attendance History</Text>
        <Text style={styles.subtitle}>
          {pagination.total} total records
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary[500]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
    flexGrow: 1,
  },
  recordCard: {
    padding: spacing.md,
  },
  recordContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statusIcon: {
    fontSize: 20,
  },
  recordInfo: {
    flex: 1,
  },
  recordDay: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  recordDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  recordRemarks: {
    ...typography.small,
    color: colors.text.muted,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  separator: {
    height: spacing.md,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
