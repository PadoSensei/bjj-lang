import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectDirectionScreen from '../../app/select-direction';
import LessonPlaceholderScreen from '../../app/lesson/[id]';
import { CourseProvider } from '../../src/context/CourseContext';

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams = { id: 'lesson-1-1' };

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
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
        <CourseProvider initialDirection="pt-BR->en">
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

  describe('LessonPlaceholderScreen', () => {
    it('renders placeholder with lesson ID and handles back navigation', () => {
      mockParams = { id: 'lesson-xyz' };

      const { getByTestId, getByText } = render(<LessonPlaceholderScreen />);

      expect(getByTestId('lesson-placeholder-card')).toBeTruthy();
      expect(getByText('Lesson Route: lesson-xyz')).toBeTruthy();

      fireEvent.press(getByTestId('back-to-home-btn'));
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });
});
