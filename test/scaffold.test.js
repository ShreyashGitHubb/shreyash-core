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
    layout: "top-nav",
    visualStyle: "terminal",
    googleAuth: true,
    deployment: "both"
  });
  const config = JSON.parse(fs.readFileSync(path.join(projectPath, "hackforge.config.json"), "utf8"));
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, "package.json"), "utf8"));
  const page = fs.readFileSync(path.join(projectPath, "app/page.tsx"), "utf8");
  const dashboard = fs.readFileSync(path.join(projectPath, "app/dashboard/page.tsx"), "utf8");
  const signInPage = fs.readFileSync(path.join(projectPath, "app/sign-in/page.tsx"), "utf8");
  const signUpPage = fs.readFileSync(path.join(projectPath, "app/sign-up/page.tsx"), "utf8");
  const authForm = fs.readFileSync(path.join(projectPath, "components/auth-form.tsx"), "utf8");
  const layout = fs.readFileSync(path.join(projectPath, "app/layout.tsx"), "utf8");

  assert.equal(config.database, "firebase");
  assert.equal(config.layout, "top-nav");
  assert.equal(config.theme, "dynamic-toggle");
  assert.equal(config.visualStyle, "terminal");
  assert.equal(config.googleSignIn, true);
  assert.deepEqual(config.routes, { landing: "/", signIn: "/sign-in", signUp: "/sign-up", dashboard: "/dashboard" });
  assert.deepEqual(config.deployment, ["vercel", "netlify"]);
  assert.ok(packageJson.dependencies.firebase);
  assert.equal(packageJson.dependencies["@supabase/supabase-js"], undefined);
  assert.ok(packageJson.devDependencies["@netlify/plugin-nextjs"]);
  assert.match(page, /Create your workspace/);
  assert.match(page, /sample-dashboard/);
  assert.match(dashboard, /Project board/);
  assert.match(dashboard, /ThemeToggle/);
  assert.match(fs.readFileSync(path.join(projectPath, "app/visual-style.css"), "utf8"), /Courier New/);
  assert.match(signInPage, /mode="sign-in"/);
  assert.match(signUpPage, /mode="sign-up"/);
  assert.match(authForm, /Create account/);
  assert.match(authForm, /GoogleSignInButton/);
  assert.match(layout, /ThemeProvider/);
  assert.ok(fs.existsSync(path.join(projectPath, "lib/backend.ts")));
  assert.ok(fs.existsSync(path.join(projectPath, "lib/google-auth.ts")));
  assert.ok(fs.existsSync(path.join(projectPath, "components/theme-toggle.tsx")));
  assert.ok(fs.existsSync(path.join(projectPath, "app/sign-in/page.tsx")));
  assert.ok(fs.existsSync(path.join(projectPath, "app/sign-up/page.tsx")));
  assert.ok(fs.existsSync(path.join(projectPath, "app/dashboard/page.tsx")));
  assert.ok(fs.existsSync(path.join(projectPath, "lib/auth.ts")));
  assert.match(fs.readFileSync(path.join(projectPath, "components/auth-form.tsx"), "utf8"), /GoogleSignInButton/);
  assert.ok(fs.existsSync(path.join(projectPath, "vercel.json")));
  assert.ok(fs.existsSync(path.join(projectPath, "netlify.toml")));
  assert.ok(fs.existsSync(path.join(projectPath, "GOOGLE_SIGN_IN.md")));
});

test("selects different generated visual directions", (context) => {
  const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "hackforge-style-test-"));
  context.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));
  const editorialPath = generateProject({
    name: "editorial-app",
    parentDir,
    database: "supabase",
    theme: "light",
    layout: "sidebar",
    visualStyle: "editorial"
  });
  const studioPath = generateProject({
    name: "studio-app",
    parentDir,
    database: "supabase",
    theme: "light",
    layout: "sidebar",
    visualStyle: "studio"
  });

  const editorialCss = fs.readFileSync(path.join(editorialPath, "app/visual-style.css"), "utf8");
  const studioCss = fs.readFileSync(path.join(studioPath, "app/visual-style.css"), "utf8");
  assert.match(editorialCss, /Georgia/);
  assert.match(studioCss, /Trebuchet MS/);
  assert.notEqual(editorialCss, studioCss);
});

test("adds Supabase Google OAuth only when selected", (context) => {
  const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "hackforge-test-"));
  context.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));
  const projectPath = generateProject({
    name: "supabase-google",
    parentDir,
    database: "supabase",
    theme: "light",
    layout: "sidebar",
    googleAuth: true,
    deployment: "none"
  });

  const config = JSON.parse(fs.readFileSync(path.join(projectPath, "hackforge.config.json"), "utf8"));
  const helper = fs.readFileSync(path.join(projectPath, "lib/google-auth.ts"), "utf8");
  assert.equal(config.authentication, "supabase+google");
  assert.match(helper, /signInWithOAuth/);
  assert.equal(fs.existsSync(path.join(projectPath, "vercel.json")), false);
  assert.equal(fs.existsSync(path.join(projectPath, "netlify.toml")), false);
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