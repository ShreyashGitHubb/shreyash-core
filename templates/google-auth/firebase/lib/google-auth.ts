import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./backend";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}