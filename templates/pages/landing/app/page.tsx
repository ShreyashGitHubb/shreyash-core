export default function LandingPage() {
  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <a className="brand" href="/"><span className="brand-mark">H</span><span>{{PROJECT_NAME}}</span></a>
        <nav className="landing-links" aria-label="Main navigation">
          <a href="#features">What you can build</a>
          <a href="/sign-in">Sign in</a>
          <a className="button primary" href="/sign-up">Start building</a>
        </nav>
      </header>
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">A head start for your next big idea</p>
          <h1>From first sketch<br />to <span>first users.</span></h1>
          <p className="intro">A ready-to-build workspace for your team. Bring an idea, invite your collaborators, and make the first version real.</p>
          <div className="button-row"><a className="button primary" href="/sign-up">Create your workspace</a><a className="button" href="/dashboard">Explore the dashboard</a></div>
        </div>
        <div className="landing-art" aria-label="A preview of a project dashboard" role="img">
          <div className="preview-window"><div className="preview-bar"><i></i><i></i><i></i><span>your next big thing</span></div><div className="preview-body"><div className="preview-sidebar"><b></b><i></i><i></i><i></i></div><div className="preview-content"><small>WEEKLY MOMENTUM</small><strong>Make it happen.</strong><div className="preview-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div className="preview-metrics"><span></span><span></span><span></span></div></div></div></div>
          <span className="art-note">Built for the brave first version.</span>
        </div>
      </section>
      <section className="landing-proof" id="features"><p className="eyebrow">Everything starts somewhere</p><div className="feature-grid"><article><span>01</span><h2>One shared space</h2><p>Keep the plan, the team, and the next steps in one clear workspace.</p></article><article><span>02</span><h2>Useful from day one</h2><p>Start with a real dashboard, sign-in flow, and backend connection points.</p></article><article><span>03</span><h2>Make it yours</h2><p>Shape the experience around the idea instead of building the scaffolding first.</p></article></div></section>
    </main>
  );
}