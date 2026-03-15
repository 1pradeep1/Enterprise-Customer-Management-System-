import { NavLink, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const nav = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/customers', icon: '👥', label: 'Customers' },
    { to: '/customers/new', icon: '➕', label: 'New Customer' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">EC</div>
        <div>
          <h1>Enterprise CRM</h1>
          <div className="subtitle">Customer Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 'auto' }}>Quick Stats</div>
        <div className="nav-item" style={{ cursor: 'default', opacity: 0.7 }}>
          <span className="nav-icon">🏢</span>
          <span style={{ fontSize: '0.82rem' }}>v1.0.0 — Spring Boot</span>
        </div>
      </nav>
    </aside>
  )
}
