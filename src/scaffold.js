import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const templateRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../templates");
const validChoices = {
  database: ["supabase", "firebase"],
  theme: ["dark", "light", "toggle"],
  layout: ["sidebar", "top-nav"]
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

function writePackageJson(destination, name, database) {
  const dependencies = {
    next: "^15.2.4",
    react: "^19.0.0",
    "react-dom": "^19.0.0"
  };
  if (database === "supabase") dependencies["@supabase/supabase-js"] = "^2.49.4";
  if (database === "firebase") dependencies.firebase = "^11.6.0";

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
    devDependencies: {
      autoprefixer: "^10.4.21",
      postcss: "^8.5.3",
      tailwindcss: "^3.4.17",
      typescript: "^5.8.3",
      "@types/node": "^22.14.0",
      "@types/react": "^19.0.12",
      "@types/react-dom": "^19.0.4"
    }
  };
  fs.writeFileSync(path.join(destination, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

function writeHackforgeConfig(destination, { name, database, theme, layout }) {
  const environmentVariables = database === "supabase"
    ? ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
    : ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"];
  const databaseLabel = database === "supabase" ? "Supabase" : "Firebase";
  const themeLabel = { dark: "dark-only", light: "light-only", toggle: "dynamic-toggle" }[theme];
  const config = {
    schemaVersion: 1,
    projectName: name,
    stack: "nextjs-app-router",
    styling: "tailwindcss",
    database,
    authentication: database,
    theme: themeLabel,
    layout,
    environmentVariables,
    aiContext: `This project uses ${databaseLabel} for database and authentication. Use ${environmentVariables.join(" and ")} for its client configuration. The UI uses ${themeLabel} theming with a ${layout} dashboard layout. Do not introduce a different backend or theme system without an explicit request.`
  };
  fs.writeFileSync(path.join(destination, "hackforge.config.json"), `${JSON.stringify(config, null, 2)}\n`);
}

function renderLayout(destination, { theme, layout }) {
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
    .replace("{{THEME_IMPORT}}", themeProvider ? 'import { ThemeToggle } from "../components/theme-toggle";' : "");
  fs.writeFileSync(layoutPath, layoutSource);
  fs.writeFileSync(pagePath, pageSource);
}

export function generateProject({ name, parentDir = process.cwd(), database, theme, layout }) {
  validateProjectName(name);
  validateChoices({ database, theme, layout });

  const destination = path.resolve(parentDir, name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) throw new Error(`Destination already exists: ${destination}`);

  fs.mkdirSync(destination);
  copyTemplate(path.join(templateRoot, "base"), destination);
  copyTemplate(path.join(templateRoot, "database", database), destination);
  copyTemplate(path.join(templateRoot, "layout", layout), destination);
  copyTemplate(path.join(templateRoot, "theme", theme), destination);
  writePackageJson(destination, name, database);
  writeHackforgeConfig(destination, { name, database, theme, layout });
  renderLayout(destination, { theme, layout });
  return destination;
}