export interface LocalizedText {
  pt: string;
  en: string;
}

export interface VocabularyItem {
  id: string;
  termPt: string;
  termEn: string;
  phonetic?: string;
  context?: LocalizedText;
}

export interface MultipleChoiceOption {
  pt: string;
  en: string;
}

export interface BaseExercise {
  id: string;
  type: 'multiple-choice' | 'translation-recall';
  explanation?: LocalizedText;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  prompt: LocalizedText;
  options: MultipleChoiceOption[];
  correctIndex: number;
}

export interface TranslationRecallExercise extends BaseExercise {
  type: 'translation-recall';
  prompt: LocalizedText;
  targetAnswer: LocalizedText;
  hint?: LocalizedText;
}

export type Exercise = MultipleChoiceExercise | TranslationRecallExercise;

export interface LessonData {
  id: string;
  unitId: string;
  title: LocalizedText;
  objective: LocalizedText;
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
}

export type SelfRating = 'correct' | 'needs-practice';

export interface MultipleChoiceResult {
  exerciseId: string;
  type: 'multiple-choice';
  selectedIndex: number;
  isCorrect: boolean;
}

export interface TranslationRecallResult {
  exerciseId: string;
  type: 'translation-recall';
  selfRating: SelfRating;
}

export type ExerciseResult = MultipleChoiceResult | TranslationRecallResult;

export interface LessonScore {
  gradedTotal: number;
  gradedCorrect: number;
  recallTotal: number;
  recallCorrect: number;
  totalExercises: number;
  totalCorrect: number;
  percentage: number;
}
