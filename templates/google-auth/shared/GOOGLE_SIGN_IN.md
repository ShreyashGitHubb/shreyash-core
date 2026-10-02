# Google sign-in setup

The starter includes a Google sign-in button and provider helper. OAuth still needs to be enabled in the backend console and Google Cloud; never commit OAuth client secrets.

## Supabase

1. Create a Google OAuth client in Google Cloud Console. Add the app's local and production origins to its authorized JavaScript origins.
2. In Supabase, open **Authentication > Providers > Google** and enter the Google client ID and secret.
3. Add Supabase's callback URL shown in that provider screen to the Google OAuth client's authorized redirect URIs. The app sends users back to `/auth/callback` after Supabase completes provider sign-in.
4. Add the local and deployed app URLs to **Authentication > URL Configuration > Redirect URLs**.

## Firebase

1. In Firebase Console, open **Authentication > Sign-in method** and enable Google.
2. In Google Cloud Console, configure the OAuth consent screen and add the project's Firebase auth handler URL (shown in Firebase's Google provider settings) as an authorized redirect URI.
3. Add local and deployed hostnames in **Authentication > Settings > Authorized domains**.
4. Put the Firebase web app configuration values in `.env.local` and in the selected deployment provider's environment settings.

The included Firebase helper uses a popup flow. The Supabase helper uses Supabase OAuth redirect flow. Configure the same provider settings for every deployed environment.