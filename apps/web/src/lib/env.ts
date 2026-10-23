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

/**
 * Absolute site URL for metadata (Open Graph, canonical links). NEXT_PUBLIC_SITE_URL wins;
 * on Vercel the production domain or the deployment URL is used.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercelHost =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  return new URL(vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
}
