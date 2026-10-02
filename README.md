# HackForge CLI

HackForge is an npm-installable interactive generator for a Next.js App Router and Tailwind CSS hackathon starter. It assembles templates for Supabase or Firebase, optional Google sign-in, dark/light theme behavior, sidebar or top navigation layouts, and Vercel and/or Netlify deployment.

## Develop this package

```sh
npm install
npm test
node ./bin/index.js
```

## Use the CLI

After publishing the package to npm, run:

```sh
npx shreyash-core
```

To generate a project without interactive prompts:

```sh
npx shreyash-core --yes --name demo --database supabase --theme toggle --layout sidebar --google-auth --deploy both
```

## Automatic npm publishing

Every push to `main` runs the tests, publishes the package to npm with provenance, and commits the published version back to `package.json` and `package-lock.json`. If the repository version is ahead of npm, that version is published first; later pushes increment the patch version. Feature branches do not publish.

One-time GitHub/npm setup:

1. Push this workflow to the GitHub repository's `main` branch.
2. On npm, open the `shreyash-core` package settings and add a **Trusted Publisher** for GitHub Actions. Set owner `ShreyashGitHubb`, repository `shreyash-core`, and workflow filename `publish.yml`.
3. In GitHub repository settings, allow GitHub Actions to read and write repository contents so the workflow can commit the version bump.
4. Push changes to `main`. Watch the **Actions > Publish to npm** run; failed tests prevent publishing.

The workflow uses npm trusted publishing (OIDC), so no npm token is stored in GitHub secrets. If npm's Trusted Publisher cannot be configured, use a granular npm publish token with 2FA bypass as a GitHub Actions secret and configure the publish step to use it.

Supported deployment values are `none`, `vercel`, `netlify`, and `both`. Google sign-in is off by default in non-interactive mode; pass `--google-auth` to enable it or `--no-google-auth` to disable it explicitly.

Every generated app has a distinct public landing page (`/`), sign-in page (`/sign-in`), sign-up page (`/sign-up`), and dashboard (`/dashboard`). The sidebar/top-nav choice controls the dashboard shell, not whether those routes exist. The dashboard starts with sample UI data; add real data access and server-side route protection before production.

The generated project includes a `hackforge.config.json` file containing its selected stack, auth mode, deployment targets, generated routes, and environment variable names. Backend credentials are configured through `.env.local`; the generated `.env.example` lists the expected keys. When enabled, `GOOGLE_SIGN_IN.md` and `DEPLOYMENT.md` explain provider-console setup, hosting configuration, and environment variables. OAuth client secrets remain in the provider dashboards and are never generated into source files.