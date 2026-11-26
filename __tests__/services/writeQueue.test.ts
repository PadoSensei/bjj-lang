import { createWriteQueue } from '../../src/services/learner/writeQueue';

/** A promise you resolve or reject by hand, to control when a task finishes. */
function deferred<T = void>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('createWriteQueue', () => {
  it('returns each task result to its caller', async () => {
    const queue = createWriteQueue({ open: true });
    await expect(queue.enqueue(async () => 42)).resolves.toBe(42);
  });

  it('starts a task synchronously when open and idle', () => {
    const queue = createWriteQueue({ open: true });
    const started: string[] = [];
    queue.enqueue(async () => {
      started.push('a');
    });
    expect(started).toEqual(['a']);
  });

  it('runs tasks one at a time, in the order they were enqueued', async () => {
    const queue = createWriteQueue({ open: true });
    const log: string[] = [];
    const first = deferred();

    const a = queue.enqueue(async () => {
      log.push('a:start');
      await first.promise;
      log.push('a:end');
    });
    const b = queue.enqueue(async () => {
      log.push('b:start');
    });

    await flush();
    expect(log).toEqual(['a:start']); // b waits for a

    first.resolve();
    await Promise.all([a, b]);
    expect(log).toEqual(['a:start', 'a:end', 'b:start']);
  });

  it('a failing task rejects for its caller but does not block later tasks', async () => {
    const queue = createWriteQueue({ open: true });
    const failing = queue.enqueue(async () => {
      throw new Error('disk full');
    });
    const next = queue.enqueue(async () => 'still runs');

    await expect(failing).rejects.toThrow('disk full');
    await expect(next).resolves.toBe('still runs');
  });

  it('holds every task until the gate opens, then runs them in order', async () => {
    const queue = createWriteQueue();
    const log: string[] = [];

    const a = queue.enqueue(async () => {
      log.push('a');
    });
    const b = queue.enqueue(async () => {
      log.push('b');
    });

    await flush();
    expect(queue.isOpen).toBe(false);
    expect(log).toEqual([]);

    queue.open();
    await Promise.all([a, b]);
    expect(queue.isOpen).toBe(true);
    expect(log).toEqual(['a', 'b']);
  });

  it('opening twice is harmless', async () => {
    const queue = createWriteQueue();
    queue.open();
    queue.open();
    await expect(queue.enqueue(async () => 'ok')).resolves.toBe('ok');
  });
});
