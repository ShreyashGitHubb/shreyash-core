{{THEME_IMPORT}}

const navigation = ["Overview", "Projects", "Team", "Settings"];

export default function HomePage() {
  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">H</span><span className="brand-name">{{PROJECT_NAME}}</span></div>
        <p className="nav-label">Workspace</p>
        <nav className="nav-list" aria-label="Main navigation">
          {navigation.map((item, index) => <a className={`nav-item ${index === 0 ? "active" : ""}`} href="#" key={item}><span>{item}</span>{index === 0 ? "◈" : "·"}</a>)}
        </nav>
      </aside>
      <main className="main-panel">
        <div className="topbar"><span className="eyebrow">Hackathon workspace</span>{{THEME_CONTROL}}</div>
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
    </div>
  );
}