{{THEME_IMPORT}}

const navigation = ["Overview", "Projects", "Team", "Settings"];

export default function HomePage() {
  return (
    <main className="main-panel">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">H</span><span>{{PROJECT_NAME}}</span></div>
        <nav className="top-links" aria-label="Main navigation">{navigation.map((item) => <a href="#" key={item}>{item}</a>)}</nav>
        {{THEME_CONTROL}}
      </header>
      <section className="headline">
        <div>
          <p className="eyebrow">Your starting point</p>
          <h1>Make something<br />worth showing.</h1>
          <p className="intro">Your workspace is ready. Connect your team, shape the first idea, and turn a blank slate into a working demo.</p>
          <div className="button-row"><a className="button primary" href="#">Create a project</a><a className="button" href="#">Invite teammates</a></div>
        </div>
      </section>
      <p className="status">Workspace initialized <span aria-hidden="true">·</span> Backend credentials can be added in <code>.env.local</code></p>
    </main>
  );
}