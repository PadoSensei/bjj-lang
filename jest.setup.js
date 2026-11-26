/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// waitFor / findBy* give up after 1s by default. On a busy machine, loading
// stored progress can take longer than that, so allow up to 5s (still well
// inside the 15s testTimeout). Passing waits still resolve immediately.
const { configure } = require('@testing-library/react-native/pure');
configure({ asyncUtilTimeout: 5000 });
