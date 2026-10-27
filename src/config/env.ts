import { z } from 'zod';

/**
 * Public Environment Schema
 * Validates public client configuration variables (EXPO_PUBLIC_*).
 * Note: None of these are strictly required for the M0 bootstrap shell to launch.
 */
export const publicEnvSchema = z.object({
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'preview', 'production']).optional().default('development'),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

/**
 * Parses and validates raw environment values.
 * Fails fast with descriptive error messages without exposing sensitive values.
 */
export function validatePublicEnv(env: Record<string, string | undefined>): PublicEnv {
  const result = publicEnvSchema.safeParse(env);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return result.data;
}

/**
 * Validated public environment configuration for the current runtime.
 */
export const env = validatePublicEnv(process.env);
