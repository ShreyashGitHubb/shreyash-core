import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Set the Supabase environment variables in .env.local.");
  return createClient(url, anonKey);
}

export async function signIn(email: string, password: string) {
  const { error } = await getClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(email: string, password: string) {
  const { error } = await getClient().auth.signUp({ email, password });
  if (error) throw error;
}