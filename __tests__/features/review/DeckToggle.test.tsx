import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DeckToggle } from '../../../src/features/review/components/DeckToggle';

describe('DeckToggle (issue #40)', () => {
  const renderToggle = (selected: 'pt-BR->en' | 'en->pt-BR' = 'pt-BR->en', onSelect = jest.fn()) =>
    render(<DeckToggle selected={selected} dueCounts={{ 'pt-BR->en': 3, 'en->pt-BR': 0 }} onSelect={onSelect} />);

  it('shows both decks by their Portuguese names, with due counts', () => {
    const { getByTestId } = renderToggle();
    expect(getByTestId('deck-toggle-pt-en-label').props.children).toBe('Português → English');
    expect(getByTestId('deck-toggle-en-pt-label').props.children).toBe('English → Português');
    expect(getByTestId('deck-toggle-pt-en-count').props.children).toBe(3);
    expect(getByTestId('deck-toggle-en-pt-count').props.children).toBe(0);
  });

  it('marks the selected deck for screen readers', () => {
    const { getByTestId } = renderToggle('en->pt-BR');
    expect(getByTestId('deck-toggle-en-pt').props.accessibilityState).toMatchObject({ selected: true });
    expect(getByTestId('deck-toggle-pt-en').props.accessibilityState).toMatchObject({ selected: false });
    expect(getByTestId('deck-toggle-en-pt').props.accessibilityRole).toBe('tab');
    expect(getByTestId('deck-toggle-pt-en').props.accessibilityLabel).toBe('Português → English, 3 para revisar');
  });

  it('reports the deck the learner picks', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderToggle('pt-BR->en', onSelect);
    fireEvent.press(getByTestId('deck-toggle-en-pt'));
    expect(onSelect).toHaveBeenCalledWith('en->pt-BR');
  });

  it('does nothing when the current deck is pressed again', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderToggle('pt-BR->en', onSelect);
    fireEvent.press(getByTestId('deck-toggle-pt-en'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
