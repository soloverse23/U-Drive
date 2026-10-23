export type AppEnv = "local" | "preview" | "staging" | "production";

const known: readonly AppEnv[] = ["local", "preview", "staging", "production"];

/**
 * NEXT_PUBLIC_APP_ENV wins; otherwise Vercel's own VERCEL_ENV decides, so a production
 * deploy with a missing variable still counts as production.
 */
export function appEnv(): AppEnv {
  const explicit = process.env.NEXT_PUBLIC_APP_ENV;
  if (explicit && (known as readonly string[]).includes(explicit)) return explicit as AppEnv;
  return process.env.VERCEL_ENV === "production" ? "production" : "local";
}

/** /design and other internal tools are never served in production. */
export function showInternalRoutes(): boolean {
  return appEnv() !== "production";
}
