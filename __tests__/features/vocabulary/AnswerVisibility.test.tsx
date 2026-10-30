import React from 'react';
import { render } from '@testing-library/react-native';
import { TranslationRecallView } from '../../../src/features/lesson/components/TranslationRecallView';
import { MultipleChoiceView } from '../../../src/features/lesson/components/MultipleChoiceView';
import { ReviewCard } from '../../../src/features/review/components/ReviewCard';
import { VocabularyItem, TranslationRecallExercise, MultipleChoiceExercise } from '../../../src/types/lesson';
import { FormattedReviewItem } from '../../../src/features/review/reviewScheduler';

describe('Answer Visibility Safeguards Integration Tests', () => {
  const vocabSample: VocabularyItem = {
    id: 'vocab-1-1-3',
    termPt: 'Com licença',
    termEn: 'Excuse me',
    context: {
      pt: 'Usado ao entrar no tatame ou pedir passagem.',
      en: 'Used when entering the mat or asking to step through.',
    },
    examplePt: 'Com licença, posso entrar no tatame?',
    exampleEn: 'Excuse me, may I step onto the mat?',
  };

  describe('TranslationRecallView Answer-Visibility Safeguards', () => {
    const recallExercise: TranslationRecallExercise = {
      id: 'ex-1-1-recall1',
      type: 'translation-recall',
      prompt: { pt: 'Com licença', en: 'Excuse me' },
      targetAnswer: { pt: 'Com licença', en: 'Excuse me' },
    };

    const formattedData = {
      promptText: 'Com licença',
      targetAnswerText: 'Excuse me',
      explanationText: 'Usado para pedir permissão.',
      matchedVocab: vocabSample,
    };

    test('hides target translation and contextual examples before Show Answer is pressed', () => {
      const { queryByTestId, getByTestId, queryByText } = render(
        <TranslationRecallView
          exercise={recallExercise}
          formatted={formattedData}
          isAnswerRevealed={false}
          isSubmitted={false}
          recallRating={null}
          onRevealAnswer={jest.fn()}
          onSubmitRating={jest.fn()}
          onNext={jest.fn()}
        />
      );

      // Prompt is visible
      expect(getByTestId('recall-prompt-text').props.children).toBe('Com licença');
      // Show Answer button is visible
      expect(getByTestId('show-answer-btn')).toBeTruthy();

      // Answer and contextual info must NOT be revealed
      expect(queryByTestId('revealed-answer-card')).toBeNull();
      expect(queryByTestId('recall-contextual-vocab')).toBeNull();
      expect(queryByText('Excuse me')).toBeNull();
      expect(queryByText('"Com licença, posso entrar no tatame?"')).toBeNull();
    });

    test('reveals target translation and contextual examples after Show Answer is pressed', () => {
      const { getByTestId, getByText } = render(
        <TranslationRecallView
          exercise={recallExercise}
          formatted={formattedData}
          isAnswerRevealed={true}
          isSubmitted={false}
          recallRating={null}
          onRevealAnswer={jest.fn()}
          onSubmitRating={jest.fn()}
          onNext={jest.fn()}
        />
      );

      expect(getByTestId('revealed-answer-card')).toBeTruthy();
      expect(getByTestId('target-answer-text').props.children).toBe('Excuse me');
      expect(getByTestId('recall-contextual-vocab')).toBeTruthy();
      expect(getByText('"Com licença, posso entrar no tatame?"')).toBeTruthy();
      expect(getByText('(Excuse me, may I step onto the mat?)')).toBeTruthy();
    });
  });

  describe('MultipleChoiceView Answer-Visibility Safeguards', () => {
    const mcExercise: MultipleChoiceExercise = {
      id: 'ex-1-1-mc1',
      type: 'multiple-choice',
      prompt: { pt: 'Como você saúda seu parceiro?', en: 'How do you greet your partner?' },
      options: [
        { pt: 'OSS', en: 'OSS' },
        { pt: 'Tchau', en: 'Goodbye' },
      ],
      correctIndex: 0,
    };

    const formattedData = {
      promptText: 'How do you greet your partner?',
      optionsText: ['OSS', 'Goodbye'],
      explanationText: 'OSS é a saudação tradicional.',
      matchedVocab: vocabSample,
    };

    test('hides feedback card and contextual examples before answer submission', () => {
      const { queryByTestId, getByTestId, queryByText } = render(
        <MultipleChoiceView
          exercise={mcExercise}
          formatted={formattedData}
          selectedOptionIndex={0}
          isSubmitted={false}
          onSelectOption={jest.fn()}
          onSubmitAnswer={jest.fn()}
          onNext={jest.fn()}
        />
      );

      expect(getByTestId('mc-prompt-text').props.children).toBe('How do you greet your partner?');
      expect(getByTestId('mc-check-btn')).toBeTruthy();

      // Feedback and contextual details must NOT be visible before submission
      expect(queryByTestId('mc-feedback-card')).toBeNull();
      expect(queryByTestId('mc-contextual-vocab')).toBeNull();
      expect(queryByText('OSS é a saudação tradicional.')).toBeNull();
    });

    test('shows feedback card and contextual examples after submission', () => {
      const { getByTestId, getByText } = render(
        <MultipleChoiceView
          exercise={mcExercise}
          formatted={formattedData}
          selectedOptionIndex={0}
          isSubmitted={true}
          onSelectOption={jest.fn()}
          onSubmitAnswer={jest.fn()}
          onNext={jest.fn()}
        />
      );

      expect(getByTestId('mc-feedback-card')).toBeTruthy();
      expect(getByTestId('mc-feedback-title').props.children).toBe('✓ Correct!');
      expect(getByTestId('mc-contextual-vocab')).toBeTruthy();
      expect(getByText('"Com licença, posso entrar no tatame?"')).toBeTruthy();
    });
  });

  describe('ReviewCard Answer-Visibility Safeguards', () => {
    const formattedItem: FormattedReviewItem = {
      vocabId: 'vocab-1-1-3',
      lessonId: 'lesson-1-1',
      promptTerm: 'Com licença',
      targetTerm: 'Excuse me',
      rawVocab: vocabSample,
    };

    test('hides target translation and contextual information before answer reveal in review', () => {
      const { queryByTestId, getByTestId, queryByText } = render(
        <ReviewCard
          formattedItem={formattedItem}
          isAnswerRevealed={false}
          isSubmitted={false}
          lastOutcome={null}
          onRevealAnswer={jest.fn()}
          onSubmitOutcome={jest.fn()}
          onNext={jest.fn()}
        />
      );

      expect(getByTestId('review-prompt-text').props.children).toBe('Com licença');
      expect(getByTestId('review-show-answer-btn')).toBeTruthy();

      expect(queryByTestId('review-revealed-card')).toBeNull();
      expect(queryByTestId('review-contextual-vocab')).toBeNull();
      expect(queryByText('Excuse me')).toBeNull();
      expect(queryByText('"Com licença, posso entrar no tatame?"')).toBeNull();
    });

    test('shows target translation and contextual information after answer reveal in review', () => {
      const { getByTestId, getByText } = render(
        <ReviewCard
          formattedItem={formattedItem}
          isAnswerRevealed={true}
          isSubmitted={false}
          lastOutcome={null}
          onRevealAnswer={jest.fn()}
          onSubmitOutcome={jest.fn()}
          onNext={jest.fn()}
        />
      );

      expect(getByTestId('review-revealed-card')).toBeTruthy();
      expect(getByTestId('review-target-term-text').props.children).toBe('Excuse me');
      expect(getByTestId('review-contextual-vocab')).toBeTruthy();
      expect(getByText('"Com licença, posso entrar no tatame?"')).toBeTruthy();
      expect(getByText('(Excuse me, may I step onto the mat?)')).toBeTruthy();
    });
  });
});
