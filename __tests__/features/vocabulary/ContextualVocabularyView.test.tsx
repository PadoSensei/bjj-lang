import React from 'react';
import { render } from '@testing-library/react-native';
import { ContextualVocabularyView } from '../../../src/features/vocabulary/components/ContextualVocabularyView';
import { VocabularyItem } from '../../../src/types/lesson';

describe('ContextualVocabularyView Component', () => {
  const fullVocab: VocabularyItem = {
    id: 'vocab-test-full',
    termPt: 'Guarda Fechada',
    termEn: 'Closed Guard',
    phonetic: 'GWAR-dah feh-SHAH-dah',
    context: {
      pt: 'Posição onde o atleta de baixo cruza as pernas atrás das costas do adversário.',
      en: 'Position where bottom athlete locks legs around opponent\'s back.',
    },
    examplePt: 'Mantenha a guarda fechada para controlar a postura.',
    exampleEn: 'Keep closed guard to control posture.',
  };

  const minimalVocab: VocabularyItem = {
    id: 'vocab-test-min',
    termPt: 'Raspagem',
    termEn: 'Sweep',
  };

  const partialVocab: VocabularyItem = {
    id: 'vocab-test-part',
    termPt: 'Passagem de Guarda',
    termEn: 'Guard Pass',
    examplePt: 'Ele fez a passagem de guarda rápida.',
  };

  test('renders full contextual vocabulary entry correctly', () => {
    const { getByTestId, getByText } = render(
      <ContextualVocabularyView vocab={fullVocab} direction="pt-BR->en" />
    );

    expect(getByTestId('contextual-vocab-view')).toBeTruthy();
    expect(getByTestId('contextual-vocab-view-primary-term').props.children).toBe('Guarda Fechada');
    expect(getByText('• Closed Guard')).toBeTruthy();
    expect(getByText('[GWAR-dah feh-SHAH-dah]')).toBeTruthy();
    expect(getByTestId('contextual-vocab-view-context-section')).toBeTruthy();
    expect(getByTestId('contextual-vocab-view-context-text').props.children).toContain('Position where bottom athlete');
    expect(getByTestId('contextual-vocab-view-examples-section')).toBeTruthy();
    expect(getByTestId('contextual-vocab-view-example-pt').props.children).toBe('"Mantenha a guarda fechada para controlar a postura."');
    expect(getByTestId('contextual-vocab-view-example-en').props.children).toBe('(Keep closed guard to control posture.)');
  });

  test('renders minimal vocabulary entry without empty containers or sections', () => {
    const { getByTestId, queryByTestId } = render(
      <ContextualVocabularyView vocab={minimalVocab} direction="pt-BR->en" />
    );

    expect(getByTestId('contextual-vocab-view')).toBeTruthy();
    expect(getByTestId('contextual-vocab-view-primary-term').props.children).toBe('Raspagem');
    expect(queryByTestId('contextual-vocab-view-phonetic')).toBeNull();
    expect(queryByTestId('contextual-vocab-view-context-section')).toBeNull();
    expect(queryByTestId('contextual-vocab-view-examples-section')).toBeNull();
  });

  test('renders partial vocabulary entry gracefully (PT example present, EN example missing)', () => {
    const { getByTestId, queryByTestId } = render(
      <ContextualVocabularyView vocab={partialVocab} direction="pt-BR->en" />
    );

    expect(getByTestId('contextual-vocab-view')).toBeTruthy();
    expect(getByTestId('contextual-vocab-view-examples-section')).toBeTruthy();
    expect(getByTestId('contextual-vocab-view-example-pt').props.children).toBe('"Ele fez a passagem de guarda rápida."');
    expect(queryByTestId('contextual-vocab-view-example-en')).toBeNull();
    expect(queryByTestId('contextual-vocab-view-context-section')).toBeNull();
  });

  test('respects showTermHeader=false prop to hide header', () => {
    const { queryByTestId, getByTestId } = render(
      <ContextualVocabularyView vocab={fullVocab} showTermHeader={false} />
    );

    expect(queryByTestId('contextual-vocab-view-header')).toBeNull();
    expect(getByTestId('contextual-vocab-view-context-section')).toBeTruthy();
  });

  test('renders correctly for en->pt-BR course direction', () => {
    const { getByTestId } = render(
      <ContextualVocabularyView vocab={fullVocab} direction="en->pt-BR" />
    );

    expect(getByTestId('contextual-vocab-view-primary-term').props.children).toBe('Closed Guard');
    expect(getByTestId('contextual-vocab-view-context-text').props.children).toContain('Posição onde o atleta');
  });
});
