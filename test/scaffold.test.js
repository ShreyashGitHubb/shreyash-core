import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateProject, validateProjectName } from "../src/scaffold.js";

test("validates safe project folder names", () => {
  assert.equal(validateProjectName("demo-app_2"), "demo-app_2");
  assert.throws(() => validateProjectName("../outside"), /folder name/);
  assert.throws(() => validateProjectName("."), /folder name/);
});

test("assembles selected templates and IDE context", (context) => {
  const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "hackforge-test-"));
  context.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));

  const projectPath = generateProject({
    name: "sample-dashboard",
    parentDir,
    database: "firebase",
    theme: "toggle",
    layout: "top-nav"
  });
  const config = JSON.parse(fs.readFileSync(path.join(projectPath, "hackforge.config.json"), "utf8"));
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, "package.json"), "utf8"));
  const page = fs.readFileSync(path.join(projectPath, "app/page.tsx"), "utf8");
  const layout = fs.readFileSync(path.join(projectPath, "app/layout.tsx"), "utf8");

  assert.equal(config.database, "firebase");
  assert.equal(config.layout, "top-nav");
  assert.equal(config.theme, "dynamic-toggle");
  assert.ok(packageJson.dependencies.firebase);
  assert.equal(packageJson.dependencies["@supabase/supabase-js"], undefined);
  assert.match(page, /ThemeToggle/);
  assert.match(page, /sample-dashboard/);
  assert.match(layout, /ThemeProvider/);
  assert.ok(fs.existsSync(path.join(projectPath, "lib/backend.ts")));
  assert.ok(fs.existsSync(path.join(projectPath, "components/theme-toggle.tsx")));
});

test("refuses to overwrite an existing destination", (context) => {
  const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "hackforge-test-"));
  context.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(parentDir, "occupied"));

  assert.throws(() => generateProject({
    name: "occupied",
    parentDir,
    database: "supabase",
    theme: "dark",
    layout: "sidebar"
  }), /already exists/);
});