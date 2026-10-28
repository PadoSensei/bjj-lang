import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectDirectionScreen from '../../app/select-direction';
import LessonScreen from '../../app/lesson/[id]';
import { CourseProvider } from '../../src/context/CourseContext';

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams = { id: 'lesson-1-1' };

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => mockParams,
}));

describe('Screen Navigation & Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SelectDirectionScreen', () => {
    it('renders both direction options and handles selection', () => {
      const { getByTestId, getByText } = render(
        <CourseProvider
          initialDirection="pt-BR->en"
          initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        >
          <SelectDirectionScreen />
        </CourseProvider>
      );

      expect(getByText('Choose Course Direction')).toBeTruthy();
      expect(getByTestId('select-pt-BR->en-card')).toBeTruthy();
      expect(getByTestId('select-en->pt-BR-card')).toBeTruthy();

      fireEvent.press(getByTestId('select-en->pt-BR-btn'));
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('LessonScreen', () => {
    it('renders lesson screen with lesson ID and handles navigation', () => {
      mockParams = { id: 'lesson-1-1' };

      const { getByTestId, getByText } = render(
        <CourseProvider
          initialDirection="pt-BR->en"
          initialCompletedLessons={{ 'pt-BR->en': [], 'en->pt-BR': [] }}
        >
          <LessonScreen />
        </CourseProvider>
      );

      expect(getByTestId('lesson-screen')).toBeTruthy();
      expect(getByText('Vocabulary Review')).toBeTruthy();

      fireEvent.press(getByTestId('lesson-close-btn'));
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });
});
