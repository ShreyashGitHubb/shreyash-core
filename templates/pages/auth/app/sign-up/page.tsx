import { AuthForm } from "../../components/auth-form";

export default function SignUpPage() {
  return <main className="auth-shell"><a className="brand" href="/"><span className="brand-mark">H</span><span>{{PROJECT_NAME}}</span></a><section className="auth-content"><p className="eyebrow">Make room for the idea</p><h1>Your next chapter<br />starts here.</h1><p className="intro">Create an account and bring your team into the workspace.</p><AuthForm mode="sign-up" /></section><p className="auth-footer">Already have an account? <a href="/sign-in">Sign in</a></p></main>;
}