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
npx create-hackforge
```

To generate a project without interactive prompts:

```sh
npx create-hackforge --yes --name demo --database supabase --theme toggle --layout sidebar --google-auth --deploy both
```

Supported deployment values are `none`, `vercel`, `netlify`, and `both`. Google sign-in is off by default in non-interactive mode; pass `--google-auth` to enable it or `--no-google-auth` to disable it explicitly.

The generated project includes a `hackforge.config.json` file containing its selected stack, auth mode, deployment targets, and environment variable names. Backend credentials are configured through `.env.local`; the generated `.env.example` lists the expected keys. When enabled, `GOOGLE_SIGN_IN.md` and `DEPLOYMENT.md` explain provider-console setup, hosting configuration, and environment variables. OAuth client secrets remain in the provider dashboards and are never generated into source files.