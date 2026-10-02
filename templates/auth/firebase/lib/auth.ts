import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./backend";

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
  await createUserWithEmailAndPassword(auth, email, password);
}