{{THEME_IMPORT}}

const navigation = ["Overview", "Projects", "Team", "Settings"];

export default function DashboardPage() {
  return (
    <main className="dashboard-main top-dashboard">
      <header className="topbar dashboard-topnav"><a className="brand" href="/"><span className="brand-mark">H</span><span>{{PROJECT_NAME}}</span></a><nav className="top-links" aria-label="Main navigation">{navigation.map((item) => <a href={item === "Overview" ? "/dashboard" : `/dashboard#${item.toLowerCase()}`} key={item}>{item}</a>)}</nav><div className="top-actions">{{THEME_CONTROL}}<a className="button" href="/sign-in">Account</a></div></header>
      <section className="dashboard-topbar"><div><p className="eyebrow">Monday, let's make it count</p><h1>Good things start here.</h1></div><button className="button primary" type="button">＋ New project</button></section>
      <section className="metric-grid" aria-label="Workspace summary"><article className="metric"><span>Active projects</span><strong>04</strong><small>Keep your ideas moving</small></article><article className="metric"><span>Team members</span><strong>08</strong><small>Good work happens together</small></article><article className="metric accent-metric"><span>This week's focus</span><strong>Ship the first version</strong><small>One clear next step is enough</small></article></section>
      <section className="dashboard-section" id="projects"><div className="section-heading"><div><p className="eyebrow">Your work</p><h2>Project board</h2></div><button className="button" type="button">View all projects</button></div><div className="project-list"><article><span className="project-symbol coral">S</span><div><b>First project</b><small>Product design · Updated today</small></div><span className="project-state">In progress</span></article><article><span className="project-symbol green">R</span><div><b>Research and discovery</b><small>Planning · Updated yesterday</small></div><span className="project-state muted-state">Planning</span></article><article><span className="project-symbol blue">L</span><div><b>Launch checklist</b><small>Operations · Updated Monday</small></div><span className="project-state">In progress</span></article></div></section>
      <section className="dashboard-section team-section" id="team"><div><p className="eyebrow">The people behind it</p><h2>Build it together.</h2></div><a className="button" href="/sign-up">Invite a teammate</a></section>
    </main>
  );
}