import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CurriculumScreen from '../../app/curriculum';
import * as registry from '../../src/content/registry';

// Node built-ins, typed just enough for the "not linked" check (the project has no @types/node).
declare const __dirname: string;
const fs = jest.requireActual('fs') as {
  readdirSync(dir: string, options: { withFileTypes: true }): { name: string; isDirectory(): boolean }[];
  readFileSync(file: string, encoding: 'utf8'): string;
};
const path = jest.requireActual('path') as {
  join(...parts: string[]): string;
  relative(from: string, to: string): string;
};

describe('Curriculum review page (/curriculum)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('summarises the whole curriculum', () => {
    const { getByTestId } = render(<CurriculumScreen />);
    expect(getByTestId('curriculum-total-words').props.children).toBe(46);
    expect(getByTestId('curriculum-total-lessons').props.children).toBe(7);
    expect(getByTestId('curriculum-total-exercises').props.children).toBe(22);
    expect(getByTestId('curriculum-total-draft').props.children).toBe(46);
    expect(getByTestId('curriculum-total-reviewed').props.children).toBe(0);
  });

  it('shows each word in English and Portuguese, with its status and explanation', () => {
    const { getByTestId } = render(<CurriculumScreen />);
    expect(getByTestId('curriculum-word-vocab-1-3-6-en').props.children).toBe('Yes');
    expect(getByTestId('curriculum-word-vocab-1-3-6-pt').props.children).toBe('Sim');
    expect(getByTestId('curriculum-word-vocab-1-3-6-status').props.children).toBe('draft');
    expect(getByTestId('curriculum-word-vocab-1-3-6-explanation').props.children).toMatch(/Resposta afirmativa/);
  });

  it('groups words by belt, White first', () => {
    const { getAllByTestId } = render(<CurriculumScreen />);
    const headings = getAllByTestId(/^curriculum-belt-heading-/).map((h) => h.props.testID);
    expect(headings).toEqual([
      'curriculum-belt-heading-white',
      'curriculum-belt-heading-blue',
      'curriculum-belt-heading-purple',
    ]);
  });

  it('filters by belt and clears the filter', () => {
    const { getByTestId, queryByTestId } = render(<CurriculumScreen />);
    fireEvent.press(getByTestId('curriculum-filter-belt-blue'));
    expect(queryByTestId('curriculum-word-vocab-1-1-1')).toBeNull();
    expect(getByTestId('curriculum-word-vocab-2-1-1')).toBeTruthy();
    expect(getByTestId('curriculum-shown-count').props.children).toBe(11);

    fireEvent.press(getByTestId('curriculum-filter-belt-all'));
    expect(getByTestId('curriculum-word-vocab-1-1-1')).toBeTruthy();
    expect(getByTestId('curriculum-shown-count').props.children).toBe(46);
  });

  it('filters by review status', () => {
    const { getByTestId } = render(<CurriculumScreen />);
    fireEvent.press(getByTestId('curriculum-filter-status-reviewed'));
    expect(getByTestId('curriculum-no-matches')).toBeTruthy();
    fireEvent.press(getByTestId('curriculum-filter-status-all'));
    expect(getByTestId('curriculum-shown-count').props.children).toBe(46);
  });

  it('searches English, Portuguese and IDs', () => {
    const { getByTestId, queryByTestId } = render(<CurriculumScreen />);
    fireEvent.changeText(getByTestId('curriculum-search'), 'sim');
    expect(getByTestId('curriculum-word-vocab-1-3-6')).toBeTruthy();
    expect(queryByTestId('curriculum-word-vocab-1-1-1')).toBeNull();
  });

  it('lists lessons and exercises with both languages', () => {
    const { getByTestId, getAllByTestId } = render(<CurriculumScreen />);
    expect(getByTestId('curriculum-lesson-lesson-1-1-title-en')).toBeTruthy();
    expect(getByTestId('curriculum-lesson-lesson-1-1-title-pt')).toBeTruthy();
    expect(getAllByTestId('curriculum-exercise-row')).toHaveLength(22);
    expect(getByTestId('curriculum-exercise-ex-1-1-mc1-prompt-pt')).toBeTruthy();
  });

  it('says when there are no stories or adventures yet', () => {
    const { getByTestId } = render(<CurriculumScreen />);
    expect(getByTestId('curriculum-stories-empty')).toBeTruthy();
    expect(getByTestId('curriculum-scenarios-empty')).toBeTruthy();
  });

  it('reports a clean validation run', () => {
    const { getByTestId } = render(<CurriculumScreen />);
    expect(getByTestId('curriculum-no-issues')).toBeTruthy();
  });

  it('lists validation issues when there are any', () => {
    jest.spyOn(registry, 'validateRegistry').mockReturnValue([
      { code: 'sentence-too-long', contentId: 'story-white-x', message: 'Page p2: "…" has 7 words; white belt allows 6.' },
    ]);
    const { getByTestId, queryByTestId } = render(<CurriculumScreen />);
    expect(queryByTestId('curriculum-no-issues')).toBeNull();
    expect(getByTestId('curriculum-issue-0').props.children).toEqual(
      expect.arrayContaining(['sentence-too-long', 'story-white-x'])
    );
    expect(getByTestId('curriculum-total-issues').props.children).toBe(1);
  });

  it('is not linked from any learner screen', () => {
    const appDir = path.join(__dirname, '../../app');
    const learnerScreens: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx?$/.test(entry.name) && !['curriculum.tsx', '_layout.tsx'].includes(entry.name)) learnerScreens.push(full);
      }
    };
    walk(appDir);
    expect(learnerScreens.length).toBeGreaterThan(3);
    for (const file of learnerScreens) {
      expect({ file: path.relative(appDir, file), links: fs.readFileSync(file, 'utf8').includes('/curriculum') }).toEqual({
        file: path.relative(appDir, file),
        links: false,
      });
    }
  });
});
