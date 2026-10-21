import { Link, NavLink } from 'react-router-dom';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="AI Project Planner home">
            <span className="brand-mark">A</span>
            <span>AI Project Planner</span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/" end>
              Projects
            </NavLink>
            <button className="avatar-button" type="button" aria-label="Account menu">SP</button>
          </nav>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}
