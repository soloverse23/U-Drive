export type { Database, Json } from "./database.types";
import type { Database } from "./database.types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type AppLocale = Database["public"]["Enums"]["app_locale"];
export type DocumentStatus = Database["public"]["Enums"]["document_status"];

/** Mirrors public.is_self_assignable_role(): roles a user may pick at onboarding. */
export const selfAssignableRoles = [
  "driver",
  "owner_individual",
  "owner_fleet",
  "owner_dealer",
] as const satisfies readonly AppRole[];
