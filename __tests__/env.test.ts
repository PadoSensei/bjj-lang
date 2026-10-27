import { validatePublicEnv } from '../src/config/env';

describe('Environment Validation', () => {
  it('parses empty object with defaults', () => {
    const config = validatePublicEnv({});
    expect(config.EXPO_PUBLIC_APP_ENV).toBe('development');
    expect(config.EXPO_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it('validates custom valid environment variables', () => {
    const config = validatePublicEnv({
      EXPO_PUBLIC_APP_ENV: 'production',
      EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
    });

    expect(config.EXPO_PUBLIC_APP_ENV).toBe('production');
    expect(config.EXPO_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co');
    expect(config.EXPO_PUBLIC_SUPABASE_ANON_KEY).toBe('test-key');
  });

  it('throws descriptive error on invalid URL', () => {
    expect(() =>
      validatePublicEnv({
        EXPO_PUBLIC_SUPABASE_URL: 'not-a-valid-url',
      })
    ).toThrow('Invalid environment configuration');
  });
});
