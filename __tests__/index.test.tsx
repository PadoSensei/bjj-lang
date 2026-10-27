import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../app/index';

describe('HomeScreen Component', () => {
  it('renders the BJJ_Lang title and bootstrap shell info', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    expect(getByTestId('app-title')).toBeTruthy();
    expect(getByText('BJJ_Lang')).toBeTruthy();
    expect(getByText('Learn the language. Understand the game. Connect through Jiu-Jitsu.')).toBeTruthy();
    expect(getByText('M0 Bootstrap Shell')).toBeTruthy();
  });
});
