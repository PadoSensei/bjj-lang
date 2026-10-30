import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCourse } from '../src/context/CourseContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { CourseDirectionSelector } from '../src/components/ui/CourseDirectionSelector';
import { Card } from '../src/components/ui/Card';
import { BeltBadge } from '../src/components/ui/BeltBadge';
import { ProgressBar } from '../src/components/ui/ProgressBar';
import { Button } from '../src/components/ui/Button';
import { formatNextReviewTime } from '../src/features/review/components/ReviewEmptyView';
import { colors, spacing, typography } from '../src/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const {
    direction,
    setDirection,
    courseData,
    courseProgress,
    dueReviewCount,
    nextReviewTimestamp,
    reviewStatistics,
  } = useCourse();

  const coursePercentage = Math.round(courseProgress.progress * 100);

  return (
    <ScreenContainer testID="home-screen-container">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header & Direction Switcher */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.appTitle} testID="app-title">
              BJJ_Lang
            </Text>
            <Text style={styles.appSubtitle} testID="app-subtitle">
              Learn language. Understand Jiu-Jitsu.
            </Text>
          </View>
          <Button
            title="Directions"
            variant="ghost"
            size="sm"
            onPress={() => router.push('/select-direction')}
            testID="open-direction-modal-btn"
          />
        </View>

        {/* Direction Switcher Selector Banner */}
        <View style={styles.selectorBanner}>
          <Text style={styles.sectionLabel}>ACTIVE LEARNING DIRECTION</Text>
          <CourseDirectionSelector
            activeDirection={direction}
            onDirectionChange={setDirection}
            testID="home-direction-selector"
          />
        </View>

        {/* Course Header Banner */}
        <Card style={styles.courseHeaderCard} testID="course-header-card">
          <Text style={styles.courseTitle} testID="course-title">
            {courseData.title}
          </Text>
          <Text style={styles.courseSubtitle}>
            {courseData.subtitle}
          </Text>

          {/* Overall Course Progress Section */}
          <View style={styles.courseProgressSection} testID="overall-course-progress-section">
            <View style={styles.courseProgressHeader}>
              <Text style={styles.courseProgressLabel}>Overall Course Progress</Text>
              <Text style={styles.courseProgressValue} testID="overall-course-progress-text">
                {`${courseProgress.completedCount} of ${courseProgress.totalCount} complete (${coursePercentage}%)`}
              </Text>
            </View>
            <ProgressBar
              progress={courseProgress.progress}
              showPercentage={false}
              testID="overall-course-progress-bar"
            />
          </View>
        </Card>

        {/* Vocabulary Review Queue Banner Card */}
        <Card style={styles.reviewCard} testID="review-queue-card">
          <View style={styles.reviewHeaderRow}>
            <View style={styles.reviewTextContainer}>
              <Text style={styles.reviewCardTitle} testID="review-card-title">
                Vocabulary Review Queue
              </Text>
              <Text style={styles.reviewCardStatusText} testID="review-card-due-text">
                {dueReviewCount > 0
                  ? `${dueReviewCount} item${dueReviewCount === 1 ? '' : 's'} due for review`
                  : 'No reviews currently due'}
              </Text>
              {dueReviewCount === 0 && (
                <Text style={styles.reviewCardSubtext} testID="review-card-subtext">
                  {formatNextReviewTime(nextReviewTimestamp)}
                </Text>
              )}
            </View>

            <Button
              title={dueReviewCount > 0 ? 'Start Review' : 'View Queue'}
              variant={dueReviewCount > 0 ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => router.push('/review')}
              testID="start-review-queue-btn"
              accessibilityLabel={
                dueReviewCount > 0
                  ? `Start vocabulary review session with ${dueReviewCount} items due`
                  : 'View vocabulary review queue'
              }
            />
          </View>
        </Card>

        {/* Compact Review Insights Card */}
        <Card style={styles.insightsCard} testID="review-insights-card">
          <View style={styles.insightsHeaderRow}>
            <View style={styles.insightsTextContainer}>
              <Text style={styles.insightsCardTitle} testID="insights-card-title">
                Review Insights
              </Text>
              {reviewStatistics.totalAttempts > 0 ? (
                <Text style={styles.insightsStatsText} testID="insights-stats-text">
                  {`${reviewStatistics.totalAttempts} total attempts • ${reviewStatistics.recallAccuracyPercentage}% accuracy • ${reviewStatistics.distinctVocabCount} terms reviewed`}
                </Text>
              ) : (
                <Text style={styles.insightsEmptyText} testID="insights-empty-text">
                  No review attempts recorded yet
                </Text>
              )}
            </View>

            <Button
              title="View History"
              variant="ghost"
              size="sm"
              onPress={() => router.push('/review/history')}
              testID="view-review-history-btn"
              accessibilityLabel="View detailed vocabulary review history"
            />
          </View>
        </Card>

        {/* Units / Learning Path Progression */}
        <View style={styles.unitsHeader}>
          <Text style={styles.unitsSectionTitle}>Learning Path</Text>
          <Text style={styles.unitsCountText}>
            {courseData.units.length} Units available
          </Text>
        </View>

        {courseData.units.map((unit) => {
          const unitCompletedCount = unit.lessons.filter((l) => l.completed).length;
          const unitTotalCount = unit.lessons.length;

          return (
            <Card key={unit.id} style={styles.unitCard} testID={`unit-card-${unit.id}`}>
              <View style={styles.unitHeader}>
                <BeltBadge belt={unit.belt} testID={`unit-belt-${unit.id}`} />
                <Text style={styles.unitTitle}>{unit.title}</Text>
              </View>

              <Text style={styles.unitDescription}>{unit.description}</Text>

              <View style={styles.progressContainer}>
                <View style={styles.unitProgressHeader}>
                  <Text style={styles.progressLabel}>Unit Progress</Text>
                  <Text style={styles.unitProgressText} testID={`unit-progress-text-${unit.id}`}>
                    {`${unitCompletedCount} of ${unitTotalCount} complete`}
                  </Text>
                </View>
                <ProgressBar
                  progress={unit.progress}
                  showPercentage
                  testID={`unit-progress-${unit.id}`}
                />
              </View>

              {/* Lessons List */}
              <View style={styles.lessonsContainer}>
                {unit.lessons.map((lesson) => (
                  <View key={lesson.id} style={styles.lessonRow} testID={`lesson-row-${lesson.id}`}>
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle} testID={`lesson-title-${lesson.id}`}>
                        <Text
                          style={[
                            styles.lessonStatusIndicator,
                            lesson.completed ? styles.statusCompleted : styles.statusIncomplete,
                          ]}
                          testID={`lesson-status-${lesson.id}`}
                        >
                          {lesson.completed ? '✓ ' : '• '}
                        </Text>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonMeta}>
                        {lesson.estimatedMinutes} min • {lesson.conceptCount} concepts
                        {lesson.completed ? ' • Completed' : ''}
                      </Text>
                    </View>

                    <Button
                      title={lesson.completed ? 'Review' : 'Start'}
                      variant={lesson.completed ? 'secondary' : 'primary'}
                      size="sm"
                      onPress={() => router.push(`/lesson/${lesson.id}`)}
                      testID={`start-lesson-btn-${lesson.id}`}
                      accessibilityLabel={`${lesson.completed ? 'Review' : 'Start'} lesson ${lesson.title}`}
                    />
                  </View>
                ))}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  appTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  appSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  selectorBanner: {
    gap: spacing.xs,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  courseHeaderCard: {
    backgroundColor: colors.surfaceHover,
    borderColor: colors.primary,
    gap: spacing.sm,
  },
  courseTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  courseSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  courseProgressSection: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    gap: spacing.xs,
  },
  courseProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  courseProgressLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  courseProgressValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.secondary,
    borderWidth: 1,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  reviewTextContainer: {
    flex: 1,
    gap: 2,
  },
  reviewCardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  reviewCardStatusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  reviewCardSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  insightsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
  },
  insightsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  insightsTextContainer: {
    flex: 1,
    gap: 2,
  },
  insightsCardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  insightsStatsText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  insightsEmptyText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  unitsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  unitsSectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  unitsCountText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  unitCard: {
    gap: spacing.md,
  },
  unitHeader: {
    gap: spacing.sm,
  },
  unitTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  unitDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  progressContainer: {
    gap: spacing.xs,
  },
  unitProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  unitProgressText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  lessonsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  lessonInfo: {
    flex: 1,
    gap: 2,
  },
  lessonTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  lessonStatusIndicator: {
    fontWeight: typography.fontWeight.bold,
  },
  statusCompleted: {
    color: colors.success,
  },
  statusIncomplete: {
    color: colors.textMuted,
  },
  lessonMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
