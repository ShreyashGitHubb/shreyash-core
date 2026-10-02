import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const templateRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../templates");
const validChoices = {
  database: ["supabase", "firebase"],
  theme: ["dark", "light", "toggle"],
  layout: ["sidebar", "top-nav"],
  deployment: ["none", "vercel", "netlify", "both"]
};

export function validateProjectName(name) {
  if (typeof name !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name) || name === "." || name === "..") {
    throw new Error("Use a folder name containing letters, numbers, dots, underscores, or hyphens; it must start with a letter or number.");
  }
  return name;
}

function validateChoices(options) {
  for (const [key, choices] of Object.entries(validChoices)) {
    if (!choices.includes(options[key])) {
      throw new Error(`Invalid ${key}: ${options[key]}. Choose ${choices.join(", ")}.`);
    }
  }
}

function copyTemplate(source, destination) {
  fs.cpSync(source, destination, { recursive: true });
}

function writePackageJson(destination, name, database, deployment, googleAuth) {
  const dependencies = {
    next: "^15.2.4",
    react: "^19.0.0",
    "react-dom": "^19.0.0"
  };
  if (database === "supabase") dependencies["@supabase/supabase-js"] = "^2.49.4";
  if (database === "firebase") dependencies.firebase = "^11.6.0";
  if (database === "supabase" && googleAuth) dependencies["@supabase/ssr"] = "^0.6.1";
  const devDependencies = {
    autoprefixer: "^10.4.21",
    postcss: "^8.5.3",
    tailwindcss: "^3.4.17",
    typescript: "^5.8.3",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.12",
    "@types/react-dom": "^19.0.4"
  };
  if (deployment === "netlify" || deployment === "both") devDependencies["@netlify/plugin-nextjs"] = "^5.11.4";

  const packageJson = {
    name: name.toLowerCase(),
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint"
    },
    dependencies,
    devDependencies
  };
  fs.writeFileSync(path.join(destination, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

function writeHackforgeConfig(destination, { name, database, theme, layout, googleAuth, deployment }) {
  const environmentVariables = database === "supabase"
    ? ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
    : ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"];
  const databaseLabel = database === "supabase" ? "Supabase" : "Firebase";
  const themeLabel = { dark: "dark-only", light: "light-only", toggle: "dynamic-toggle" }[theme];
  const deployments = deployment === "both" ? ["vercel", "netlify"] : deployment === "none" ? [] : [deployment];
  const authentication = googleAuth ? `${database}+google` : database;
  const config = {
    schemaVersion: 1,
    projectName: name,
    stack: "nextjs-app-router",
    styling: "tailwindcss",
    database,
    authentication,
    googleSignIn: googleAuth,
    theme: themeLabel,
    layout,
    deployment: deployments,
    environmentVariables,
    aiContext: `This project uses ${databaseLabel} for database and authentication${googleAuth ? " with Google sign-in enabled" : ""}. Use ${environmentVariables.join(" and ")} for its client configuration. The UI uses ${themeLabel} theming with a ${layout} dashboard layout. Deployment targets: ${deployments.length ? deployments.join(" and ") : "none configured"}. Do not introduce a different backend or theme system without an explicit request.`
  };
  fs.writeFileSync(path.join(destination, "hackforge.config.json"), `${JSON.stringify(config, null, 2)}\n`);
}

function renderLayout(destination, { theme, layout, googleAuth }) {
  const layoutPath = path.join(destination, "app", "layout.tsx");
  const pagePath = path.join(destination, "app", "page.tsx");
  const themeProvider = theme === "toggle";
  const layoutSource = fs.readFileSync(layoutPath, "utf8")
    .replace("{{THEME_IMPORT}}", themeProvider ? 'import { ThemeProvider } from "../components/theme-provider";' : "")
    .replace("{{THEME_OPEN}}", themeProvider ? "<ThemeProvider>" : "")
    .replace("{{THEME_CLOSE}}", themeProvider ? "</ThemeProvider>" : "");
  const pageSource = fs.readFileSync(pagePath, "utf8")
    .replace("{{PROJECT_NAME}}", path.basename(destination))
    .replace("{{THEME_CONTROL}}", themeProvider ? '<ThemeToggle />' : "")
    .replace("{{THEME_IMPORT}}", themeProvider ? 'import { ThemeToggle } from "../components/theme-toggle";' : "")
    .replace("{{GOOGLE_AUTH_IMPORT}}", googleAuth ? 'import { GoogleSignInButton } from "../components/google-sign-in-button";' : "")
    .replace("{{GOOGLE_AUTH_CONTROL}}", googleAuth ? "<GoogleSignInButton />" : "");
  fs.writeFileSync(layoutPath, layoutSource);
  fs.writeFileSync(pagePath, pageSource);
}

export function generateProject({ name, parentDir = process.cwd(), database, theme, layout, googleAuth = false, deployment = "none" }) {
  validateProjectName(name);
  validateChoices({ database, theme, layout, deployment });
  if (typeof googleAuth !== "boolean") throw new Error("googleAuth must be true or false.");

  const destination = path.resolve(parentDir, name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) throw new Error(`Destination already exists: ${destination}`);

  fs.mkdirSync(destination);
  copyTemplate(path.join(templateRoot, "base"), destination);
  copyTemplate(path.join(templateRoot, "database", database), destination);
  copyTemplate(path.join(templateRoot, "layout", layout), destination);
  copyTemplate(path.join(templateRoot, "theme", theme), destination);
  if (googleAuth) copyTemplate(path.join(templateRoot, "google-auth", database), destination);
  if (deployment === "vercel" || deployment === "both") copyTemplate(path.join(templateRoot, "deployment", "vercel"), destination);
  if (deployment === "netlify" || deployment === "both") copyTemplate(path.join(templateRoot, "deployment", "netlify"), destination);
  if (deployment !== "none") copyTemplate(path.join(templateRoot, "deployment", "shared"), destination);
  if (googleAuth) copyTemplate(path.join(templateRoot, "google-auth", "shared"), destination);
  writePackageJson(destination, name, database, deployment, googleAuth);
  writeHackforgeConfig(destination, { name, database, theme, layout, googleAuth, deployment });
  renderLayout(destination, { theme, layout, googleAuth });
  return destination;
}