import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CourseDirection } from '../../../components/ui/CourseDirectionSelector';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { findVocabItemById } from '../useReviewSession';
import { ReviewHistoryEntry } from '../../../types/history';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface ReviewHistoryViewProps {
  historyEntries: ReviewHistoryEntry[];
  direction: CourseDirection;
  isLoading?: boolean;
  hasError?: boolean;
  onReturnToCourse: () => void;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ReviewHistoryItemRow({
  entry,
  direction,
}: {
  entry: ReviewHistoryEntry;
  direction: CourseDirection;
}) {
  const lookup = findVocabItemById(entry.vocabId);
  const isEnToPt = direction === 'en->pt-BR';

  let promptTerm = 'Unknown term';
  let targetTerm = '';
  let isMissingVocab = false;

  if (lookup) {
    promptTerm = isEnToPt ? lookup.vocab.termEn : lookup.vocab.termPt;
    targetTerm = isEnToPt ? lookup.vocab.termPt : lookup.vocab.termEn;
  } else {
    isMissingVocab = true;
  }

  const isRemembered = entry.outcome === 'remembered';

  return (
    <Card style={styles.historyCard} testID={`history-item-${entry.id}`}>
      <View style={styles.cardHeader}>
        <View style={styles.termContainer}>
          <Text style={styles.promptTerm} testID={`history-prompt-term-${entry.id}`}>
            {promptTerm}
          </Text>
          {targetTerm ? (
            <Text style={styles.targetTerm} testID={`history-target-term-${entry.id}`}>
              {targetTerm}
            </Text>
          ) : null}
          {isMissingVocab && (
            <View style={styles.missingBadge} testID={`missing-vocab-badge-${entry.id}`}>
              <Text style={styles.missingBadgeText}>Reference Missing</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.outcomeBadge,
            isRemembered ? styles.outcomeBadgeRemembered : styles.outcomeBadgeNeedsPractice,
          ]}
          testID={`outcome-badge-${entry.id}`}
        >
          <Text
            style={[
              styles.outcomeBadgeText,
              isRemembered ? styles.outcomeBadgeTextRemembered : styles.outcomeBadgeTextNeedsPractice,
            ]}
          >
            {isRemembered ? 'Remembered' : 'Needs Practice'}
          </Text>
        </View>
      </View>

      <Text style={styles.dateText} testID={`history-date-${entry.id}`}>
        {formatDate(entry.completedAt)}
      </Text>
    </Card>
  );
}

export const ReviewHistoryView: React.FC<ReviewHistoryViewProps> = ({
  historyEntries,
  direction,
  isLoading = false,
  hasError = false,
  onReturnToCourse,
}) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer} testID="history-loading-state">
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.centerContainer} testID="history-error-state">
        <Text style={styles.errorTitle}>Storage Error</Text>
        <Text style={styles.errorText}>Unable to load review history right now.</Text>
        <Button title="Return to Course Overview" variant="primary" onPress={onReturnToCourse} />
      </View>
    );
  }

  if (historyEntries.length === 0) {
    return (
      <View style={styles.centerContainer} testID="history-empty-state">
        <Text style={styles.emptyTitle}>No Review History</Text>
        <Text style={styles.emptyText}>
          Completed vocabulary review attempts for this direction will appear here.
        </Text>
        <Button
          title="Return to Course Overview"
          variant="primary"
          onPress={onReturnToCourse}
          testID="history-empty-return-btn"
        />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="history-view">
      <FlatList
        data={historyEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewHistoryItemRow entry={item} direction={direction} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  historyCard: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  termContainer: {
    flex: 1,
    gap: 2,
    paddingRight: spacing.sm,
  },
  promptTerm: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  targetTerm: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  missingBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  missingBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  outcomeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outcomeBadgeRemembered: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
  },
  outcomeBadgeNeedsPractice: {
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
  },
  outcomeBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  outcomeBadgeTextRemembered: {
    color: colors.success,
  },
  outcomeBadgeTextNeedsPractice: {
    color: colors.warning,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
