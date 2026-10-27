import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCourse } from '../src/context/CourseContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { Card } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { colors, spacing, typography } from '../src/theme/tokens';

export default function SelectDirectionScreen() {
  const router = useRouter();
  const { direction, setDirection } = useCourse();

  const handleSelect = (selectedDirection: typeof direction) => {
    setDirection(selectedDirection);
    router.back();
  };

  return (
    <ScreenContainer testID="select-direction-screen">
      <View style={styles.content}>
        <Text style={styles.title}>Choose Course Direction</Text>
        <Text style={styles.description}>
          Select your learning goal. BJJ_Lang supports both Portuguese-to-English and
          English-to-Portuguese BJJ language courses.
        </Text>

        <Card
          style={[
            styles.optionCard,
            direction === 'pt-BR->en' && styles.selectedOptionCard,
          ]}
          onPress={() => handleSelect('pt-BR->en')}
          testID="select-pt-BR->en-card"
          accessibilityLabel="Português to English course direction"
        >
          <View style={styles.optionHeader}>
            <Text style={styles.flags}>🇧🇷 ➔ 🇺🇸</Text>
            <Text style={styles.optionTitle}>Português ➔ English</Text>
          </View>
          <Text style={styles.optionDescription}>
            Aprenda termos e expressões de Jiu-Jitsu em inglês para treinar fora do Brasil.
          </Text>
          <Button
            title={direction === 'pt-BR->en' ? 'Active Course' : 'Select'}
            variant={direction === 'pt-BR->en' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => handleSelect('pt-BR->en')}
            style={styles.selectBtn}
            testID="select-pt-BR->en-btn"
            accessibilityLabel="Select Português to English course direction"
          />
        </Card>

        <Card
          style={[
            styles.optionCard,
            direction === 'en->pt-BR' && styles.selectedOptionCard,
          ]}
          onPress={() => handleSelect('en->pt-BR')}
          testID="select-en->pt-BR-card"
          accessibilityLabel="English to Português course direction"
        >
          <View style={styles.optionHeader}>
            <Text style={styles.flags}>🇺🇸 ➔ 🇧🇷</Text>
            <Text style={styles.optionTitle}>English ➔ Português</Text>
          </View>
          <Text style={styles.optionDescription}>
            Learn Portuguese academy commands, position names, and mat culture.
          </Text>
          <Button
            title={direction === 'en->pt-BR' ? 'Active Course' : 'Select'}
            variant={direction === 'en->pt-BR' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => handleSelect('en->pt-BR')}
            style={styles.selectBtn}
            testID="select-en->pt-BR-btn"
            accessibilityLabel="Select English to Português course direction"
          />
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  optionCard: {
    gap: spacing.sm,
  },
  selectedOptionCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHover,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flags: {
    fontSize: typography.fontSize.lg,
  },
  optionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  selectBtn: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
});
