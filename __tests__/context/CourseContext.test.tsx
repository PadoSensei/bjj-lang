import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { CourseProvider, useCourse } from '../../src/context/CourseContext';

const TestComponent = () => {
  const { direction, setDirection, courseData } = useCourse();
  return (
    <>
      <Text testID="direction-text">{direction}</Text>
      <Text testID="course-title">{courseData.title}</Text>
      <Button
        testID="switch-btn"
        title="Switch"
        onPress={() => setDirection('en->pt-BR')}
      />
    </>
  );
};

describe('CourseContext', () => {
  it('provides default direction and allows switching', () => {
    const { getByTestId } = render(
      <CourseProvider initialDirection="pt-BR->en">
        <TestComponent />
      </CourseProvider>
    );

    expect(getByTestId('direction-text').props.children).toBe('pt-BR->en');
    expect(getByTestId('course-title').props.children).toBe('Aprenda Inglês para Jiu-Jitsu');

    fireEvent.press(getByTestId('switch-btn'));

    expect(getByTestId('direction-text').props.children).toBe('en->pt-BR');
    expect(getByTestId('course-title').props.children).toBe('Learn Brazilian Portuguese for BJJ');
  });
});
