import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { BeltBadge } from '../../src/components/ui/BeltBadge';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { CourseDirectionSelector } from '../../src/components/ui/CourseDirectionSelector';

describe('UI Primitives', () => {
  describe('Button', () => {
    it('renders with title and responds to press', () => {
      const onPressMock = jest.fn();
      const { getByText, getByRole } = render(
        <Button title="Tap Me" onPress={onPressMock} testID="test-btn" />
      );

      expect(getByText('Tap Me')).toBeTruthy();
      fireEvent.press(getByRole('button'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('renders loading state and disables press', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Button title="Tap Me" loading onPress={onPressMock} testID="test-btn" />
      );

      expect(getByTestId('test-btn-loading')).toBeTruthy();
      fireEvent.press(getByTestId('test-btn'));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Card', () => {
    it('renders children and handles onPress', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Card onPress={onPressMock} testID="card-test">
          <Button title="Card Button" />
        </Card>
      );

      expect(getByTestId('card-test')).toBeTruthy();
      fireEvent.press(getByTestId('card-test'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('BeltBadge', () => {
    it('renders correctly for blue belt', () => {
      const { getByText } = render(<BeltBadge belt="blue" testID="badge-test" />);
      expect(getByText('Blue Belt')).toBeTruthy();
    });

    it('renders custom label when provided', () => {
      const { getByText } = render(<BeltBadge belt="purple" label="Faixa Roxa" />);
      expect(getByText('Faixa Roxa')).toBeTruthy();
    });
  });

  describe('ProgressBar', () => {
    it('calculates progress and percentage correctly', () => {
      const { getByTestId, getByText } = render(
        <ProgressBar progress={0.75} showPercentage testID="pb" />
      );

      expect(getByTestId('pb-fill')).toBeTruthy();
      expect(getByText('75%')).toBeTruthy();
    });
  });

  describe('CourseDirectionSelector', () => {
    it('renders both options and switches direction on press', () => {
      const onChangeMock = jest.fn();
      const { getByTestId } = render(
        <CourseDirectionSelector
          activeDirection="pt-BR->en"
          onDirectionChange={onChangeMock}
          testID="dir-select"
        />
      );

      fireEvent.press(getByTestId('dir-select-option-en->pt-BR'));
      expect(onChangeMock).toHaveBeenCalledWith('en->pt-BR');
    });
  });
});
