import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../app/index';
import { CourseProvider } from '../src/context/CourseContext';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('HomeScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the BJJ_Lang title and course content', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider>
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByTestId('app-title')).toBeTruthy();
    expect(getByTestId('app-title').props.children).toBe('BJJ_Lang');
    expect(getByText('Aprenda Inglês para Jiu-Jitsu')).toBeTruthy();
  });

  it('switches learning direction and updates displayed content', () => {
    const { getByTestId, getByText } = render(
      <CourseProvider initialDirection="pt-BR->en">
        <HomeScreen />
      </CourseProvider>
    );

    expect(getByText('Aprenda Inglês para Jiu-Jitsu')).toBeTruthy();

    // Click direction switch option
    fireEvent.press(getByTestId('home-direction-selector-option-en->pt-BR'));

    expect(getByText('Learn Brazilian Portuguese for BJJ')).toBeTruthy();
  });

  it('navigates to lesson placeholder when start button is pressed', () => {
    const { getByTestId } = render(
      <CourseProvider>
        <HomeScreen />
      </CourseProvider>
    );

    const startBtn = getByTestId('start-lesson-btn-lesson-1-1');
    fireEvent.press(startBtn);

    expect(mockPush).toHaveBeenCalledWith('/lesson/lesson-1-1');
  });
});
