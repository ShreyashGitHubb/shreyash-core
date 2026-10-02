{{THEME_IMPORT}}

const navigation = [
  { label: "Overview", href: "/dashboard", icon: "◈" },
  { label: "Projects", href: "/dashboard#projects", icon: "▤" },
  { label: "Team", href: "/dashboard#team", icon: "◎" },
  { label: "Settings", href: "/dashboard#settings", icon: "⚙" }
];

export default function DashboardPage() {
  return (
    <div className="workspace">
      <aside className="sidebar">
        <a className="brand" href="/"><span className="brand-mark">H</span><span className="brand-name">{{PROJECT_NAME}}</span></a>
        <p className="nav-label">Workspace</p>
        <nav className="nav-list" aria-label="Main navigation">{navigation.map((item, index) => <a className={`nav-item ${index === 0 ? "active" : ""}`} href={item.href} key={item.label}><span>{item.label}</span>{item.icon}</a>)}</nav>
        <a className="sidebar-profile" href="/sign-in"><span className="avatar">Y</span><span><b>Your account</b><small>Manage profile</small></span></a>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-topbar"><div><p className="eyebrow">Monday, let's make it count</p><h1>Good things start here.</h1></div>{{THEME_CONTROL}}<a className="button" href="/sign-in">Account</a></header>
        <section className="metric-grid" aria-label="Workspace summary"><article className="metric"><span>Active projects</span><strong>04</strong><small>Keep your ideas moving</small></article><article className="metric"><span>Team members</span><strong>08</strong><small>Good work happens together</small></article><article className="metric accent-metric"><span>This week's focus</span><strong>Ship the first version</strong><small>One clear next step is enough</small></article></section>
        <section className="dashboard-section" id="projects"><div className="section-heading"><div><p className="eyebrow">Your work</p><h2>Project board</h2></div><button className="button primary" type="button">＋ New project</button></div><div className="project-list"><article><span className="project-symbol coral">S</span><div><b>First project</b><small>Product design · Updated today</small></div><span className="project-state">In progress</span></article><article><span className="project-symbol green">R</span><div><b>Research and discovery</b><small>Planning · Updated yesterday</small></div><span className="project-state muted-state">Planning</span></article><article><span className="project-symbol blue">L</span><div><b>Launch checklist</b><small>Operations · Updated Monday</small></div><span className="project-state">In progress</span></article></div></section>
        <section className="dashboard-section team-section" id="team"><div><p className="eyebrow">The people behind it</p><h2>Build it together.</h2></div><a className="button" href="/sign-up">Invite a teammate</a></section>
      </main>
    </div>
  );
}