import { createBrowserClient } from "@supabase/ssr";

export async function signInWithGoogle() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Set the Supabase environment variables in .env.local.");

  const supabase = createBrowserClient(url, anonKey);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  });
  if (error) throw error;
}