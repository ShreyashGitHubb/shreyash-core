import { AuthForm } from "../../components/auth-form";

export default function SignInPage() {
  return <main className="auth-shell"><a className="brand" href="/"><span className="brand-mark">H</span><span>{{PROJECT_NAME}}</span></a><section className="auth-content"><p className="eyebrow">Welcome back</p><h1>Pick up where<br />you left off.</h1><p className="intro">Sign in to get back to your team and your work.</p><AuthForm mode="sign-in" /></section><p className="auth-footer">New to the workspace? <a href="/sign-up">Create an account</a></p></main>;
}