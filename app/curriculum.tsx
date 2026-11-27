/**
 * Curriculum review page: /curriculum
 *
 * An editor tool for the owner and content reviewers, not part of the learner
 * app: no learner screen links here, and it reads no learner data. It shows
 * every piece of content in the registry, by belt, with English and Portuguese
 * side by side, review status and validation issues.
 */
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getContentSet, validateRegistry } from '../src/content/registry';
import {
  BELT_ORDER,
  CurriculumFilters,
  CurriculumWordRow,
  buildCurriculumReport,
  filterCurriculumItems,
  lessonTitlesFromLegacy,
} from '../src/content/curriculumReport';
import { MOCK_LESSONS } from '../src/data/mockLessons';
import type { Belt } from '../src/domain/content/types';
import { colors, radii, spacing, typography } from '../src/theme/tokens';

const beltLabel = (belt: Belt) => colors.belts[belt].label;

function Chip({ label, selected, onPress, testID }: { label: string; selected: boolean; onPress: () => void; testID: string }) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function Stat({ label, value, testID }: { label: string; value: number; testID: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} testID={testID}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function WordRow({ word }: { word: CurriculumWordRow }) {
  const id = `curriculum-word-${word.id}`;
  return (
    <View style={styles.row} testID={id}>
      <View style={styles.pair}>
        <View style={styles.half}>
          <Text style={styles.langTag}>EN</Text>
          <Text style={styles.term} testID={`${id}-en`}>
            {word.en}
          </Text>
        </View>
        <View style={styles.half}>
          <Text style={styles.langTag}>PT</Text>
          <Text style={styles.term} testID={`${id}-pt`}>
            {word.pt}
          </Text>
        </View>
      </View>
      {word.explanationPt ? (
        <Text style={styles.explanation} testID={`${id}-explanation`}>
          {word.explanationPt}
        </Text>
      ) : (
        <Text style={styles.warning}>No Portuguese explanation</Text>
      )}
      <Text style={styles.meta}>
        {word.id} · {word.cefr} · {word.reviewable ? 'flashcard' : 'not a flashcard'} ·{' '}
        <Text testID={`${id}-status`}>{word.status}</Text>
        {word.reviewer ? ` by ${word.reviewer}` : ''}
        {word.lessonIds.length > 0 ? ` · ${word.lessonIds.join(', ')}` : ''}
      </Text>
    </View>
  );
}

export default function CurriculumScreen() {
  const report = useMemo(
    () => buildCurriculumReport(getContentSet(), validateRegistry(), lessonTitlesFromLegacy(MOCK_LESSONS)),
    []
  );
  const [filters, setFilters] = useState<CurriculumFilters>({});

  const presentBelts = report.belts.map((section) => section.belt);
  const allWords = report.belts.flatMap((section) => section.words);
  const shown = filterCurriculumItems(allWords, filters);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} testID="curriculum-screen">
      <Text style={styles.title} accessibilityRole="header">
        Curriculum review
      </Text>
      <Text style={styles.subtitle}>
        Everything in the content registry. Editor tool: not part of the learner app.
      </Text>

      <View style={styles.stats}>
        <Stat label="words" value={report.totals.words} testID="curriculum-total-words" />
        <Stat label="lessons" value={report.totals.lessons} testID="curriculum-total-lessons" />
        <Stat label="exercises" value={report.totals.exercises} testID="curriculum-total-exercises" />
        <Stat label="stories" value={report.totals.stories} testID="curriculum-total-stories" />
        <Stat label="adventures" value={report.totals.scenarios} testID="curriculum-total-scenarios" />
        <Stat label="reviewed" value={report.totals.reviewed} testID="curriculum-total-reviewed" />
        <Stat label="draft" value={report.totals.draft} testID="curriculum-total-draft" />
        <Stat label="issues" value={report.totals.issues} testID="curriculum-total-issues" />
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Validation
      </Text>
      {report.issues.length === 0 ? (
        <Text style={styles.ok} testID="curriculum-no-issues">
          No validation issues.
        </Text>
      ) : (
        report.issues.map((issue, index) => (
          <Text key={index} style={styles.issue} testID={`curriculum-issue-${index}`}>
            {issue.code}
            {' in '}
            {issue.contentId}
            {': '}
            {issue.message}
          </Text>
        ))
      )}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Words
      </Text>
      <View style={styles.chips}>
        <Chip label="All belts" selected={!filters.belt} onPress={() => setFilters({ ...filters, belt: undefined })} testID="curriculum-filter-belt-all" />
        {BELT_ORDER.filter((b) => presentBelts.includes(b)).map((belt) => (
          <Chip
            key={belt}
            label={beltLabel(belt)}
            selected={filters.belt === belt}
            onPress={() => setFilters({ ...filters, belt })}
            testID={`curriculum-filter-belt-${belt}`}
          />
        ))}
      </View>
      <View style={styles.chips}>
        <Chip label="Any status" selected={!filters.status} onPress={() => setFilters({ ...filters, status: undefined })} testID="curriculum-filter-status-all" />
        <Chip label="Draft" selected={filters.status === 'draft'} onPress={() => setFilters({ ...filters, status: 'draft' })} testID="curriculum-filter-status-draft" />
        <Chip label="Reviewed" selected={filters.status === 'reviewed'} onPress={() => setFilters({ ...filters, status: 'reviewed' })} testID="curriculum-filter-status-reviewed" />
      </View>
      <TextInput
        style={styles.search}
        placeholder="Search ID, English or Portuguese"
        placeholderTextColor={colors.textMuted}
        value={filters.query ?? ''}
        onChangeText={(query) => setFilters({ ...filters, query })}
        accessibilityLabel="Search words"
        autoCapitalize="none"
        autoCorrect={false}
        testID="curriculum-search"
      />
      <Text style={styles.meta}>
        Showing <Text testID="curriculum-shown-count">{shown.length}</Text> of {allWords.length} words
      </Text>

      {shown.length === 0 ? (
        <Text style={styles.empty} testID="curriculum-no-matches">
          No words match these filters.
        </Text>
      ) : (
        BELT_ORDER.filter((belt) => shown.some((w) => w.belt === belt)).map((belt) => (
          <View key={belt} style={styles.beltSection}>
            <Text style={styles.beltHeading} testID={`curriculum-belt-heading-${belt}`} accessibilityRole="header">
              {beltLabel(belt)}
            </Text>
            {shown
              .filter((w) => w.belt === belt)
              .map((word) => (
                <WordRow key={word.id} word={word} />
              ))}
          </View>
        ))
      )}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Lessons
      </Text>
      {report.belts.flatMap((section) =>
        section.lessons.map((lesson) => (
          <View key={lesson.id} style={styles.row} testID={`curriculum-lesson-${lesson.id}`}>
            <View style={styles.pair}>
              <Text style={[styles.term, styles.half]} testID={`curriculum-lesson-${lesson.id}-title-en`}>
                {lesson.title?.en ?? lesson.id}
              </Text>
              <Text style={[styles.term, styles.half]} testID={`curriculum-lesson-${lesson.id}-title-pt`}>
                {lesson.title?.pt ?? lesson.id}
              </Text>
            </View>
            <Text style={styles.meta}>
              {lesson.id} · {beltLabel(section.belt)} · words: {lesson.itemIds.join(', ')} · exercises:{' '}
              {lesson.exerciseIds.join(', ')}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Exercises
      </Text>
      {report.exercises.map((exercise) => {
        const id = `curriculum-exercise-${exercise.id}`;
        return (
          <View key={exercise.id} style={styles.row} testID="curriculum-exercise-row">
            <View style={styles.pair}>
              <Text style={[styles.body, styles.half]} testID={`${id}-prompt-en`}>
                {exercise.prompt.en}
              </Text>
              <Text style={[styles.body, styles.half]} testID={`${id}-prompt-pt`}>
                {exercise.prompt.pt}
              </Text>
            </View>
            <Text style={styles.meta}>
              {exercise.id} · {exercise.type} · answer: {exercise.answer.en} | {exercise.answer.pt}
            </Text>
          </View>
        );
      })}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Stories
      </Text>
      {report.stories.length === 0 ? (
        <Text style={styles.empty} testID="curriculum-stories-empty">
          None yet.
        </Text>
      ) : (
        report.stories.map((story) => (
          <View key={story.id} style={styles.row} testID={`curriculum-story-${story.id}`}>
            <View style={styles.pair}>
              <Text style={[styles.term, styles.half]}>{story.title.en}</Text>
              <Text style={[styles.term, styles.half]}>{story.title.pt}</Text>
            </View>
            {story.pages.map((page) => (
              <View key={page.id} style={styles.pair}>
                <Text style={[styles.body, styles.half]}>
                  {page.tokens
                    .map((t) => t.text)
                    .join(' ')
                    .replace(/\s+([.,!?;:])/g, '$1')}
                </Text>
                <Text style={[styles.body, styles.half]}>{page.pt}</Text>
              </View>
            ))}
            <Text style={styles.meta}>
              {story.id} · {beltLabel(story.belt)} · {story.review.status}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Adventures
      </Text>
      {report.scenarios.length === 0 ? (
        <Text style={styles.empty} testID="curriculum-scenarios-empty">
          None yet.
        </Text>
      ) : (
        report.scenarios.map((scenario) => (
          <View key={scenario.id} style={styles.row} testID={`curriculum-scenario-${scenario.id}`}>
            <View style={styles.pair}>
              <Text style={[styles.term, styles.half]}>{scenario.title.en}</Text>
              <Text style={[styles.term, styles.half]}>{scenario.title.pt}</Text>
            </View>
            {Object.entries(scenario.nodes).map(([nodeId, node]) => (
              <View key={nodeId} style={styles.node}>
                <View style={styles.pair}>
                  <Text style={[styles.body, styles.half]}>
                    {nodeId}: {node.narrative.en}
                  </Text>
                  <Text style={[styles.body, styles.half]}>{node.narrative.pt}</Text>
                </View>
                {node.choices.map((choice) => (
                  <View key={choice.id} style={styles.pair} testID={`curriculum-choice-${scenario.id}-${choice.id}`}>
                    <Text style={[styles.meta, styles.half]}>
                      → {choice.text} (to {choice.nextNodeId}) · feedback: {choice.feedback.en}
                    </Text>
                    <Text style={[styles.meta, styles.half]}>{choice.feedback.pt}</Text>
                  </View>
                ))}
                {node.ending ? <Text style={styles.meta}>ending: {node.ending}</Text> : null}
              </View>
            ))}
            <Text style={styles.meta}>
              {scenario.id} · {beltLabel(scenario.belt)} · {scenario.review.status}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 1100, width: '100%', alignSelf: 'center' },
  title: { color: colors.textPrimary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold },
  subtitle: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: spacing.xs, marginBottom: spacing.md },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  stat: {
    minWidth: 88,
    padding: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statValue: { color: colors.textPrimary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  statLabel: { color: colors.textSecondary, fontSize: typography.fontSize.xs },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  ok: { color: colors.success, fontSize: typography.fontSize.sm },
  issue: { color: colors.error, fontSize: typography.fontSize.sm, marginBottom: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.surfaceHover },
  chipText: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  chipTextSelected: { color: colors.textPrimary },
  search: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  beltSection: { marginTop: spacing.md },
  beltHeading: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  row: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: spacing.xs,
  },
  pair: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  node: { marginTop: spacing.xs, gap: spacing.xs },
  langTag: { color: colors.textMuted, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  term: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium },
  body: { color: colors.textPrimary, fontSize: typography.fontSize.sm },
  explanation: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  warning: { color: colors.warning, fontSize: typography.fontSize.sm },
  meta: { color: colors.textMuted, fontSize: typography.fontSize.xs },
  empty: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
});
