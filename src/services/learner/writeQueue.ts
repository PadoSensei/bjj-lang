/**
 * A serial queue for learner-state writes.
 *
 * Every write that reads the current state, changes it and saves it must run
 * through one of these, so two writes can never start from the same snapshot
 * and overwrite each other.
 *
 * The queue starts closed when stored progress still has to be loaded:
 * writes wait until `open()` is called, so they never build on empty defaults.
 *
 * When the queue is open and idle, a task starts synchronously. That keeps
 * state updates as prompt as a direct call, which callers and tests rely on.
 */
export interface WriteQueue {
  /** Run `task` after every earlier task has settled and the queue is open. */
  enqueue<T>(task: () => Promise<T>): Promise<T>;
  /** Let queued and future tasks run. Safe to call more than once. */
  open(): void;
  readonly isOpen: boolean;
}

export interface WriteQueueOptions {
  /** Start open (no hydration to wait for). Defaults to false. */
  open?: boolean;
}

/** Start a task right away; a synchronous throw becomes a rejected promise. */
function startNow<T>(task: () => Promise<T>): Promise<T> {
  try {
    return task();
  } catch (error) {
    return Promise.reject(error);
  }
}

export function createWriteQueue(options: WriteQueueOptions = {}): WriteQueue {
  let isOpen = options.open ?? false;
  let release: () => void = () => {};
  const gate: Promise<void> = isOpen
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        release = resolve;
      });

  let tail: Promise<void> = Promise.resolve();
  let inFlight = 0;

  return {
    get isOpen() {
      return isOpen;
    },

    open() {
      if (!isOpen) {
        isOpen = true;
        release();
      }
    },

    enqueue<T>(task: () => Promise<T>): Promise<T> {
      inFlight += 1;
      const runNow = isOpen && inFlight === 1;
      const result: Promise<T> = runNow
        ? startNow(task)
        : tail.then(() => gate).then(task);

      // The next task waits for this one to settle, whether it succeeded or not.
      tail = result.then(
        () => undefined,
        () => undefined
      ).then(() => {
        inFlight -= 1;
      });

      return result;
    },
  };
}
