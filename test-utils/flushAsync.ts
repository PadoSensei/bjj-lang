import { act } from '@testing-library/react-native';

/**
 * Let every pending promise settle, then flush React updates and effects.
 *
 * Storage in tests is the in-memory AsyncStorage mock, which resolves through
 * promises only (no timers). So "wait until loading has finished" does not
 * need waitFor's wall-clock polling: draining the microtask queue a few times
 * is enough, and it behaves the same on a fast machine and on one that is
 * overloaded or swapping, where waitFor can run out of time between checks.
 */
export async function flushAsync(rounds = 3): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    // A macrotask runs only after every queued microtask has settled.
    await act(() => new Promise<void>((resolve) => setImmediate(resolve)));
  }
}
