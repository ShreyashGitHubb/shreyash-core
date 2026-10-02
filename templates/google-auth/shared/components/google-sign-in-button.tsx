"use client";

import { signInWithGoogle } from "../lib/google-auth";

export function GoogleSignInButton() {
  return (
    <button className="button" onClick={() => void signInWithGoogle()} type="button">
      Continue with Google
    </button>
  );
}