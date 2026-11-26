/**
 * Content integrity validators (issue #38, ADR-008).
 *
 * Pure functions: each takes content plus a ContentIndex (how to look other
 * content up) and returns a list of issues. An empty list means valid.
 * Level rules come from docs/content/CURRICULUM.md.
 */
import type { Belt, ContentLesson, LexicalItem, Scenario, Story } from './types';

export type ContentIssueCode =
  | 'dangling-reference'
  | 'missing-node'
  | 'unreachable-node'
  | 'dead-end-node'
  | 'belt-ceiling'
  | 'duplicate-id'
  | 'sentence-too-long'
  | 'missing-support-pt';

export interface ContentIssue {
  code: ContentIssueCode;
  /** The story, scenario, lesson or item the issue is in. */
  contentId: string;
  message: string;
}

/** How validators look up other content. The registry provides the real one. */
export interface ContentIndex {
  /** Belt of a lexical item, or undefined if the item does not exist. */
  getItemBelt(itemId: string): Belt | undefined;
  hasExercise(exerciseId: string): boolean;
}

const BELT_RANK: Record<Belt, number> = { white: 0, blue: 1, purple: 2, brown: 3, black: 4 };

/** Maximum English words per sentence. Belts without an entry have no limit. */
export const MAX_WORDS_PER_SENTENCE: Partial<Record<Belt, number>> = { white: 6, blue: 12 };

/** Words in a sentence; punctuation-only tokens do not count. */
export function countWords(text: string): number {
  return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

/** Split text into sentences ending in . ! or ? (a final fragment counts too). */
export function splitSentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]*/g) ?? []).map((s) => s.trim()).filter((s) => s.length > 0);
}

function sentenceIssues(contentId: string, belt: Belt, text: string, where: string): ContentIssue[] {
  const max = MAX_WORDS_PER_SENTENCE[belt];
  if (max === undefined) return [];
  return splitSentences(text)
    .filter((sentence) => countWords(sentence) > max)
    .map((sentence) => ({
      code: 'sentence-too-long' as const,
      contentId,
      message: `${where}: "${sentence}" has ${countWords(sentence)} words; ${belt} belt allows ${max}.`,
    }));
}

function danglingItems(contentId: string, itemIds: string[], index: ContentIndex, where: string): ContentIssue[] {
  return itemIds
    .filter((id) => index.getItemBelt(id) === undefined)
    .map((id) => ({ code: 'dangling-reference' as const, contentId, message: `${where} references unknown item ${id}.` }));
}

function danglingExercises(contentId: string, exerciseIds: string[], index: ContentIndex, where: string): ContentIssue[] {
  return exerciseIds
    .filter((id) => !index.hasExercise(id))
    .map((id) => ({ code: 'dangling-reference' as const, contentId, message: `${where} references unknown exercise ${id}.` }));
}

/** Items may not be above the belt of the content that uses them. Unknown items are ignored here. */
export function validateBeltCeiling(
  contentId: string,
  belt: Belt,
  itemIds: string[],
  index: ContentIndex
): ContentIssue[] {
  const issues: ContentIssue[] = [];
  for (const id of new Set(itemIds)) {
    const itemBelt = index.getItemBelt(id);
    if (itemBelt !== undefined && BELT_RANK[itemBelt] > BELT_RANK[belt]) {
      issues.push({
        code: 'belt-ceiling',
        contentId,
        message: `Item ${id} is ${itemBelt} belt, above this ${belt} belt content.`,
      });
    }
  }
  return issues;
}

/** A reviewed (publishable) White Belt item needs a Portuguese explanation. Drafts may be incomplete. */
export function validateLexicalItem(item: LexicalItem): ContentIssue[] {
  if (item.belt === 'white' && item.review.status === 'reviewed' && !item.support?.pt?.trim()) {
    return [
      {
        code: 'missing-support-pt',
        contentId: item.id,
        message: `Reviewed White Belt item ${item.id} has no Portuguese explanation (support.pt).`,
      },
    ];
  }
  return [];
}

export function validateLesson(lesson: ContentLesson, index: ContentIndex): ContentIssue[] {
  return [
    ...danglingItems(lesson.id, lesson.itemIds, index, 'Lesson'),
    ...danglingExercises(lesson.id, lesson.exerciseIds, index, 'Lesson'),
    ...validateBeltCeiling(lesson.id, lesson.belt, lesson.itemIds, index),
  ];
}

/** Rebuild a page's English text from its tokens, without spaces before punctuation. */
function pageText(tokens: Story['pages'][number]['tokens']): string {
  return tokens
    .map((t) => t.text)
    .join(' ')
    .replace(/\s+([.,!?;:])/g, '$1');
}

export function validateStory(story: Story, index: ContentIndex): ContentIssue[] {
  const itemIds = story.pages.flatMap((page) =>
    page.tokens.flatMap((token) => (token.itemId ? [token.itemId] : []))
  );
  return [
    ...danglingItems(story.id, itemIds, index, 'Story'),
    ...danglingExercises(story.id, story.comprehensionExerciseIds, index, 'Story'),
    ...validateBeltCeiling(story.id, story.belt, itemIds, index),
    ...story.pages.flatMap((page) => sentenceIssues(story.id, story.belt, pageText(page.tokens), `Page ${page.id}`)),
  ];
}

export function validateScenario(scenario: Scenario, index: ContentIndex): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const nodeIds = Object.keys(scenario.nodes);
  const missingNode = (message: string) => issues.push({ code: 'missing-node', contentId: scenario.id, message });

  if (!scenario.nodes[scenario.startNodeId]) {
    missingNode(`Start node ${scenario.startNodeId} does not exist.`);
  }

  for (const [nodeId, node] of Object.entries(scenario.nodes)) {
    if (!node.ending && node.choices.length === 0) {
      issues.push({
        code: 'dead-end-node',
        contentId: scenario.id,
        message: `Node ${nodeId} has no choices and no ending: the learner would be stuck.`,
      });
    }
    for (const choice of node.choices) {
      if (!scenario.nodes[choice.nextNodeId]) {
        missingNode(`Choice ${choice.id} in node ${nodeId} leads to missing node ${choice.nextNodeId}.`);
      }
      issues.push(...danglingItems(scenario.id, choice.itemIds, index, `Choice ${choice.id}`));
      issues.push(...sentenceIssues(scenario.id, scenario.belt, choice.text, `Choice ${choice.id}`));
    }
    issues.push(...sentenceIssues(scenario.id, scenario.belt, node.narrative.en, `Node ${nodeId}`));
  }

  // Every node must be reachable from the start.
  const reached = new Set<string>();
  const queue = scenario.nodes[scenario.startNodeId] ? [scenario.startNodeId] : [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (reached.has(id)) continue;
    reached.add(id);
    for (const choice of scenario.nodes[id].choices) {
      if (scenario.nodes[choice.nextNodeId] && !reached.has(choice.nextNodeId)) {
        queue.push(choice.nextNodeId);
      }
    }
  }
  for (const nodeId of nodeIds) {
    if (!reached.has(nodeId)) {
      issues.push({ code: 'unreachable-node', contentId: scenario.id, message: `Node ${nodeId} cannot be reached from the start.` });
    }
  }

  const choiceItemIds = Object.values(scenario.nodes).flatMap((node) => node.choices.flatMap((c) => c.itemIds));
  issues.push(...validateBeltCeiling(scenario.id, scenario.belt, choiceItemIds, index));
  return issues;
}

/** No ID may be used twice, across all kinds of content. Each duplicate is reported once. */
export function validateUniqueIds(ids: string[]): ContentIssue[] {
  const seen = new Set<string>();
  const reported = new Set<string>();
  const issues: ContentIssue[] = [];
  for (const id of ids) {
    if (seen.has(id) && !reported.has(id)) {
      reported.add(id);
      issues.push({ code: 'duplicate-id', contentId: id, message: `ID ${id} is used by more than one piece of content.` });
    }
    seen.add(id);
  }
  return issues;
}

export interface ContentSet {
  lexicalItems: LexicalItem[];
  lessons: ContentLesson[];
  stories: Story[];
  scenarios: Scenario[];
  allIds: string[];
}

/** Run every validator over a whole set of content. */
export function validateAll(content: ContentSet, index: ContentIndex): ContentIssue[] {
  return [
    ...validateUniqueIds(content.allIds),
    ...content.lexicalItems.flatMap(validateLexicalItem),
    ...content.lessons.flatMap((lesson) => validateLesson(lesson, index)),
    ...content.stories.flatMap((story) => validateStory(story, index)),
    ...content.scenarios.flatMap((scenario) => validateScenario(scenario, index)),
  ];
}
