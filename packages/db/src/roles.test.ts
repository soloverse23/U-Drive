import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { selfAssignableRoles } from "./index";

const migrationsDir = new URL("../supabase/migrations/", import.meta.url);
const sql = readdirSync(migrationsDir)
  .sort()
  .map((file) => readFileSync(new URL(file, migrationsDir), "utf8"))
  .join("\n");

describe("selfAssignableRoles", () => {
  it("matches public.is_self_assignable_role() in the migrations", () => {
    const match = /is_self_assignable_role[\s\S]*?select r in \(([^)]*)\)/.exec(sql);
    const fromSql = match?.[1]?.split(",").map((s) => s.trim().replace(/'/g, ""));
    expect(fromSql).toEqual([...selfAssignableRoles]);
  });

  it("never includes privileged roles", () => {
    for (const role of ["admin", "accountant", "partner"]) {
      expect(selfAssignableRoles).not.toContain(role);
    }
  });
});
