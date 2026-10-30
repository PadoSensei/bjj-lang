import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { CourseDirection } from '../../../components/ui/CourseDirectionSelector';
import { VocabularyItem } from '../../../types/lesson';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface ContextualVocabularyViewProps {
  vocab: VocabularyItem;
  direction?: CourseDirection;
  showTermHeader?: boolean;
  showContextExplanation?: boolean;
  showExamples?: boolean;
  testID?: string;
}

export const ContextualVocabularyView: React.FC<ContextualVocabularyViewProps> = ({
  vocab,
  direction = 'pt-BR->en',
  showTermHeader = true,
  showContextExplanation = true,
  showExamples = true,
  testID = 'contextual-vocab-view',
}) => {
  const isEnToPt = direction === 'en->pt-BR';

  const primaryTerm = isEnToPt ? vocab.termEn : vocab.termPt;
  const secondaryTerm = isEnToPt ? vocab.termPt : vocab.termEn;

  let contextExplanation: string | undefined;
  if (vocab.context) {
    contextExplanation = isEnToPt
      ? vocab.context.pt || vocab.context.en
      : vocab.context.en || vocab.context.pt;
  }

  const hasPhonetic = Boolean(vocab.phonetic);
  const hasContext = Boolean(showContextExplanation && contextExplanation);
  const hasExamplePt = Boolean(vocab.examplePt);
  const hasExampleEn = Boolean(vocab.exampleEn);
  const hasExamplesSection = Boolean(showExamples && (hasExamplePt || hasExampleEn));

  return (
    <Card style={styles.card} testID={testID}>
      {showTermHeader ? (
        <View style={styles.headerSection} testID={`${testID}-header`}>
          <View style={styles.termRow}>
            <Text style={styles.primaryTerm} testID={`${testID}-primary-term`}>
              {primaryTerm}
            </Text>
            <Text style={styles.secondaryTerm} testID={`${testID}-secondary-term`}>
              • {secondaryTerm}
            </Text>
          </View>

          {hasPhonetic ? (
            <Text style={styles.phoneticText} testID={`${testID}-phonetic`}>
              {`[${vocab.phonetic}]`}
            </Text>
          ) : null}
        </View>
      ) : null}

      {hasContext ? (
        <View style={styles.sectionContainer} testID={`${testID}-context-section`}>
          <Text style={styles.sectionLabel}>BJJ Context:</Text>
          <Text style={styles.contextText} testID={`${testID}-context-text`}>
            {contextExplanation}
          </Text>
        </View>
      ) : null}

      {hasExamplesSection ? (
        <View style={styles.sectionContainer} testID={`${testID}-examples-section`}>
          <Text style={styles.sectionLabel}>Example:</Text>
          {hasExamplePt ? (
            <Text style={styles.examplePtText} testID={`${testID}-example-pt`}>
              {`"${vocab.examplePt}"`}
            </Text>
          ) : null}
          {hasExampleEn ? (
            <Text style={styles.exampleEnText} testID={`${testID}-example-en`}>
              {`(${vocab.exampleEn})`}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
  },
  headerSection: {
    gap: spacing.xs,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  primaryTerm: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryTerm: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  phoneticText: {
    color: colors.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  sectionContainer: {
    gap: 2,
    backgroundColor: colors.surfaceHover,
    padding: spacing.sm,
    borderRadius: 8,
  },
  sectionLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contextText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  examplePtText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  exampleEnText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
});
