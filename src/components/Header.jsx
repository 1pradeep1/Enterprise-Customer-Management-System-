import { useLocation } from 'react-router-dom'

const titles = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/customers/new': 'New Customer',
}

export default function Header() {
  const { pathname } = useLocation()

  let title = titles[pathname] || 'Enterprise CRM'
  if (pathname.match(/\/customers\/\d+\/edit/)) title = 'Edit Customer'
  else if (pathname.match(/\/customers\/\d+/)) title = 'Customer Details'

  return (
    <header className="header">
      <h2 className="header-title">{title}</h2>
      <div className="header-actions">
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
    </header>
  )
}
