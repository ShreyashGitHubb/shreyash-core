#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";
import { generateProject, validateProjectName } from "../src/scaffold.js";

const choices = {
  database: ["supabase", "firebase"],
  theme: ["dark", "light", "toggle"],
  layout: ["sidebar", "top-nav"]
};

function readArguments(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument === "--yes" || argument === "-y") options.yes = true;
    else if (["--name", "--dir", "--database", "--theme", "--layout"].includes(argument)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`);
      options[argument.slice(2)] = value;
      index += 1;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }
  return options;
}

function printHelp() {
  console.log(`create-hackforge [options]

Create a Next.js + Tailwind starter with your chosen backend and UI shell.

Options:
  --name <folder>       Project folder name
  --dir <parent>        Parent directory (defaults to the current directory)
  --database <choice>   supabase | firebase
  --theme <choice>      dark | light | toggle
  --layout <choice>     sidebar | top-nav
  --yes, -y             Use defaults for any omitted choices
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

  const projectPath = generateProject({
    name,
    parentDir: options.dir,
    database,
    theme,
    layout
  });

  console.log(`\nCreated ${projectPath}`);
  console.log(`\nNext steps:\n  cd ${name}\n  npm install\n  npm run dev`);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
});