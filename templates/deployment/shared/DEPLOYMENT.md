# Deployment setup

The selected host configuration is included in this project. Push the project to a Git provider, import it in each selected host, and keep the build command as `npm run build`.

## Environment variables

Copy the variables from `.env.example` into each host's project environment settings. Add them for preview and production environments as needed. Do not commit `.env.local` or provider secrets.

## Vercel

Import the Git repository at Vercel. The Next.js framework and build command are declared in `vercel.json`. Set the required environment variables in **Project Settings > Environment Variables**, then deploy.

## Netlify

Import the Git repository at Netlify. `netlify.toml` enables the Next.js runtime plugin; `@netlify/plugin-nextjs` is included as a development dependency. Set the required environment variables in **Site configuration > Environment variables**, then deploy.

If Google sign-in is enabled, add the deployed site URL to the backend provider's authorized redirect URLs or domains as described in `GOOGLE_SIGN_IN.md`.