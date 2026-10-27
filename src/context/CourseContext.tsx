import React, { createContext, useContext, useState } from 'react';
import { CourseDirection } from '../components/ui/CourseDirectionSelector';
import { CourseData, MOCK_COURSES } from '../data/mockCourseData';

export interface CourseContextType {
  direction: CourseDirection;
  setDirection: (dir: CourseDirection) => void;
  courseData: CourseData;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export interface CourseProviderProps {
  children: React.ReactNode;
  initialDirection?: CourseDirection;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  children,
  initialDirection = 'pt-BR->en',
}) => {
  const [direction, setDirection] = useState<CourseDirection>(initialDirection);
  const courseData = MOCK_COURSES[direction];

  return (
    <CourseContext.Provider
      value={{
        direction,
        setDirection,
        courseData,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
