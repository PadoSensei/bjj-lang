import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { useCourse } from '../../src/context/CourseContext';
import { LessonHeader } from '../../src/features/lesson/components/LessonHeader';
import { ReviewHistoryView } from '../../src/features/review/components/ReviewHistoryView';
import { DeckToggle } from '../../src/features/review/components/DeckToggle';
import { spacing } from '../../src/theme/tokens';

export default function ReviewHistoryScreen() {
  const router = useRouter();
  const { direction, setDirection, historyMap, activeHistory } = useCourse();
  const historyCounts = useMemo(
    () => ({
      'pt-BR->en': (historyMap['pt-BR->en'] || []).length,
      'en->pt-BR': (historyMap['en->pt-BR'] || []).length,
    }),
    [historyMap]
  );

  const handleReturnToCourse = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const isEnToPt = direction === 'en->pt-BR';
  const headerTitle = isEnToPt
    ? 'Review History (Portuguese)'
    : 'Review History (English)';

  return (
    <ScreenContainer testID="review-history-screen">
      <View style={styles.container}>
        <LessonHeader
          title={headerTitle}
          progressText={`${activeHistory.length} Total Attempts`}
          progressValue={1}
          onClose={handleReturnToCourse}
        />

        <DeckToggle
          selected={direction}
          dueCounts={historyCounts}
          onSelect={setDirection}
          countLabel="tentativas"
        />

        <View style={styles.content}>
          <ReviewHistoryView
            historyEntries={activeHistory}
            direction={direction}
            onReturnToCourse={handleReturnToCourse}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: spacing.xs,
  },
});
