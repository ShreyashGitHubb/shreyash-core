# HackForge CLI

HackForge is an npm-installable interactive generator for a Next.js App Router and Tailwind CSS hackathon starter. It assembles templates for Supabase or Firebase, dark/light theme behavior, and sidebar or top navigation layouts.

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
npx create-hackforge --yes --name demo --database supabase --theme toggle --layout sidebar
```

The generated project includes a `hackforge.config.json` file containing its selected stack and environment variable names. Backend credentials are configured through `.env.local`; the generated `.env.example` lists the expected keys.