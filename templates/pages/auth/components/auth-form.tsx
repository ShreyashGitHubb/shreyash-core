"use client";

import { useState, type FormEvent } from "react";
import { signIn, signUp } from "../lib/auth";
{{GOOGLE_AUTH_IMPORT}}

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    try {
      await (mode === "sign-in" ? signIn(email, password) : signUp(email, password));
      window.location.assign("/dashboard");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-form-wrap">
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email address</label><input autoComplete="email" id="email" name="email" required type="email" placeholder="you@example.com" />
      <label htmlFor="password">Password</label><input autoComplete={mode === "sign-in" ? "current-password" : "new-password"} id="password" minLength={8} name="password" required type="password" placeholder="At least 8 characters" />
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="button primary auth-submit" disabled={busy} type="submit">{busy ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}</button>
    </form>
    {{GOOGLE_AUTH_CONTROL}}
  </div>;
}