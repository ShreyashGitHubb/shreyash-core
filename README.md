# shreyash-core

An interactive command-line generator for hackathon-ready Next.js projects. Choose a backend, authentication options, theme, dashboard navigation, and hosting configuration, then get a project scaffold with separate landing, authentication, and dashboard routes.

## Quick Start

```sh
npx shreyash-core@latest
```

Check which CLI release npm runs with `npx --yes shreyash-core@latest --version`. A project created earlier is a copy of the templates from the time it was generated; installing a newer CLI does not rewrite that existing directory. Generate into a new directory to get updated pages and styling.

The CLI asks for a project directory and the options to include, then prints the commands to install and run the generated project.

To select everything from the command line instead:

```sh
npx shreyash-core \
  --yes \
  --name my-hackathon-app \
  --database supabase \
  --theme toggle \
  --layout sidebar \
  --style editorial \
  --google-auth \
  --deploy vercel
```

Run the generated app:

```sh
cd my-hackathon-app
npm install
npm run dev
```

Open `http://localhost:3000` after the development server starts.

## What It Generates

Every project has these routes:

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/sign-in` | Email/password sign-in, with optional Google sign-in |
| `/sign-up` | Email/password account creation, with optional Google sign-in |
| `/dashboard` | Starter workspace dashboard |

The dashboard uses the navigation layout you select. It currently contains sample project and team information so you can replace it with your application data.

The generated project also includes:

- Next.js App Router, React, TypeScript, and Tailwind CSS setup
- Supabase or Firebase client setup and email authentication helpers
- Optional Google OAuth helper and sign-in button
- Dark-only, light-only, or switchable theme
- Optional Vercel and/or Netlify configuration files
- `.env.example` with the environment variable names for the selected backend
- `hackforge.config.json` describing the selected stack and generated routes
- Setup guides for Google sign-in and deployment when those options are selected

## Interactive Choices

- **Backend:** Supabase or Firebase
- **Theme:** dark only, light only, or a dynamic toggle
- **Dashboard layout:** sidebar or top navigation
- **Visual direction:** studio, editorial, or terminal
- **Google sign-in:** optional; configure OAuth in the provider and Google Cloud dashboards
- **Deployment setup:** none, Vercel, Netlify, or both

Deployment setup adds provider configuration files and instructions; it does not create hosting accounts or deploy the project automatically.

## CLI Options

| Option | Values or meaning |
| --- | --- |
| `--name <folder>` | Name of the new project directory |
| `--dir <parent>` | Parent directory; defaults to the current directory |
| `--database <choice>` | `supabase` or `firebase` |
| `--theme <choice>` | `dark`, `light`, or `toggle` |
| `--layout <choice>` | `sidebar` or `top-nav` |
| `--style <choice>` | `studio`, `editorial`, or `terminal` |
| `--google-auth` | Include Google sign-in setup |
| `--no-google-auth` | Explicitly omit Google sign-in |
| `--deploy <choice>` | `none`, `vercel`, `netlify`, or `both` |
| `--yes`, `-y` | Use defaults for options not supplied |
| `--help`, `-h` | Print command help |

With `--yes`, omitted options default to Supabase, dark-only theme, sidebar navigation, studio visual style, Google sign-in off, and no deployment configuration. A project name is still required.

## Configure the Backend

After generation, copy the relevant values from `.env.example` into a local `.env.local` file, then fill in your project credentials. Never commit `.env.local`, OAuth client secrets, or other private credentials.

For Google OAuth and hosting setup, follow `GOOGLE_SIGN_IN.md` and `DEPLOYMENT.md` in the generated project when present. Google provider settings and authorized redirect URLs must be configured in the provider dashboards.

## Production Notes

The scaffold gives you working starter UI and client-side email authentication calls. It is not a complete production security setup:

- Protect `/dashboard` and other private routes with server-side authentication checks before using them for private data.
- Replace dashboard sample content with your own database queries and authorization rules.
- Configure Supabase policies or Firebase Security Rules for the data your app stores.
- Configure and test OAuth redirect URLs for local, preview, and production environments.
- Set environment variables separately in each hosting provider.

## Develop This Package

Requirements: Node.js 18 or newer and npm.

```sh
git clone https://github.com/ShreyashGitHubb/shreyash-core.git
cd shreyash-core
npm install
npm test
node ./bin/index.js
```

Before submitting changes, run `npm test`. To inspect the files that would be published:

```sh
npm pack --dry-run
```

## npm Releases

The GitHub Actions workflow in `.github/workflows/publish.yml` runs on pushes to `main`. It runs the tests, selects a package version newer than the latest npm release, publishes with provenance, and commits any version bump back to the repository.

Publishing requires an npm Trusted Publisher configured for GitHub Actions with:

- Owner: `ShreyashGitHubb`
- Repository: `shreyash-core`
- Workflow filename: `publish.yml`
- Environment: blank, unless the workflow is changed to use a GitHub Environment
- Allowed action: direct `npm publish`

The package manifest's `repository.url` must match the GitHub repository. GitHub Actions also needs permission to write repository contents so it can commit version updates. No npm token is needed when Trusted Publishing is configured correctly.

## License

No license is currently specified. Add a license before encouraging reuse or redistribution of this package.
