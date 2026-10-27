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
import { colors, spacing, typography } from '../src/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { direction, setDirection, courseData } = useCourse();

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
        </Card>

        {/* Units / Learning Path Progression */}
        <View style={styles.unitsHeader}>
          <Text style={styles.unitsSectionTitle}>Learning Path</Text>
          <Text style={styles.unitsCountText}>
            {courseData.units.length} Units available
          </Text>
        </View>

        {courseData.units.map((unit) => (
          <Card key={unit.id} style={styles.unitCard} testID={`unit-card-${unit.id}`}>
            <View style={styles.unitHeader}>
              <BeltBadge belt={unit.belt} testID={`unit-belt-${unit.id}`} />
              <Text style={styles.unitTitle}>{unit.title}</Text>
            </View>

            <Text style={styles.unitDescription}>{unit.description}</Text>

            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Unit Progress</Text>
              <ProgressBar
                progress={unit.progress}
                showPercentage
                testID={`unit-progress-${unit.id}`}
              />
            </View>

            {/* Lessons List */}
            <View style={styles.lessonsContainer}>
              {unit.lessons.map((lesson) => (
                <View key={lesson.id} style={styles.lessonRow}>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>
                      {lesson.completed ? '✓ ' : '• '}{lesson.title}
                    </Text>
                    <Text style={styles.lessonMeta}>
                      {lesson.estimatedMinutes} min • {lesson.conceptCount} concepts
                    </Text>
                  </View>

                  <Button
                    title={lesson.completed ? 'Review' : 'Start'}
                    variant={lesson.completed ? 'secondary' : 'primary'}
                    size="sm"
                    onPress={() => router.push(`/lesson/${lesson.id}`)}
                    testID={`start-lesson-btn-${lesson.id}`}
                  />
                </View>
              ))}
            </View>
          </Card>
        ))}
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
    gap: spacing.xs,
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
  progressLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
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
  lessonMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
