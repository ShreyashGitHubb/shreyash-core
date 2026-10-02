#!/usr/bin/env node
import { confirm, input, select } from "@inquirer/prompts";
import { createRequire } from "node:module";
import { generateProject, validateProjectName } from "../src/scaffold.js";

const packageJson = createRequire(import.meta.url)("../package.json");

const choices = {
  database: ["supabase", "firebase"],
  theme: ["dark", "light", "toggle"],
  layout: ["sidebar", "top-nav"],
  visualStyle: ["studio", "editorial", "terminal"],
  deployment: ["none", "vercel", "netlify", "both"]
};

function readArguments(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument === "--version" || argument === "-v") options.version = true;
    else if (argument === "--yes" || argument === "-y") options.yes = true;
    else if (argument === "--google-auth") options.googleAuth = true;
    else if (argument === "--no-google-auth") options.googleAuth = false;
    else if (["--name", "--dir", "--database", "--theme", "--layout", "--style", "--deploy"].includes(argument)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`);
      const key = argument === "--deploy" ? "deployment" : argument === "--style" ? "visualStyle" : argument.slice(2);
      options[key] = value;
      index += 1;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }
  return options;
}

function printHelp() {
  console.log(`shreyash-core [options]

Create a Next.js + Tailwind starter with your chosen backend and UI shell.

Options:
  --name <folder>       Project folder name
  --dir <parent>        Parent directory (defaults to the current directory)
  --database <choice>   supabase | firebase
  --theme <choice>      dark | light | toggle
  --layout <choice>     sidebar | top-nav
  --style <choice>      studio | editorial | terminal
  --google-auth         Include Google sign-in setup
  --deploy <choice>     none | vercel | netlify | both
  --yes, -y             Use defaults for any omitted choices
  --version, -v         Show CLI version
  --help, -h            Show this help`);
}

async function choose(options, key, message, labels) {
  if (options[key]) return options[key];
  if (options.yes) return choices[key][0] === "supabase" ? "supabase" : choices[key][0];
  return select({
    message,
    choices: choices[key].map((value) => ({ value, name: labels[value] }))
  });
}

async function main() {
  const options = readArguments(process.argv.slice(2));
  if (options.version) return console.log(packageJson.version);
  if (options.help) return printHelp();

  const name = options.name ?? (options.yes
    ? undefined
    : await input({
      message: "Project folder name",
      default: "hackforge-app",
      validate: (value) => {
        try {
          validateProjectName(value);
          return true;
        } catch (error) {
          return error.message;
        }
      }
    }));

  if (!name) throw new Error("Pass --name <folder> when using --yes.");

  const database = await choose(options, "database", "Choose database and auth provider", {
    supabase: "Supabase (Postgres + Auth)",
    firebase: "Firebase (Firestore + Auth)"
  });
  const theme = await choose(options, "theme", "Choose theme behavior", {
    dark: "Dark mode only",
    light: "Light mode only",
    toggle: "Dynamic light/dark toggle"
  });
  const layout = await choose(options, "layout", "Choose dashboard layout", {
    sidebar: "Sidebar navigation",
    "top-nav": "Top navigation"
  });
  const visualStyle = await choose(options, "visualStyle", "Choose a visual direction", {
    studio: "Studio: warm color, soft geometry",
    editorial: "Editorial: refined type, open space",
    terminal: "Terminal: technical grid, sharp contrast"
  });
  const googleAuth = options.googleAuth ?? (!options.yes && await confirm({
    message: "Include Google sign-in configuration?",
    default: false
  }));
  const deployment = await choose(options, "deployment", "Add deployment setup", {
    none: "Not now",
    vercel: "Vercel",
    netlify: "Netlify",
    both: "Vercel and Netlify"
  });

  const projectPath = generateProject({
    name,
    parentDir: options.dir,
    database,
    theme,
    layout,
    visualStyle,
    googleAuth,
    deployment
  });

  console.log(`\nCreated ${projectPath}`);
  console.log(`\nNext steps:\n  cd "${projectPath}"\n  npm install\n  npm run dev`);
  if (googleAuth) console.log("  Configure the provider using GOOGLE_SIGN_IN.md");
  if (deployment !== "none") console.log("  Review DEPLOYMENT.md and add environment variables to your hosting provider");
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
});