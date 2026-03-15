import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  const cards = [
    { label: 'Total Customers', value: stats?.totalCustomers ?? 0, icon: '👥', color: 'blue' },
    { label: 'Active', value: stats?.activeCustomers ?? 0, icon: '✅', color: 'green' },
    { label: 'Onboarding', value: stats?.onboardingCustomers ?? 0, icon: '🚀', color: 'amber' },
    { label: 'Prospects', value: stats?.prospectCustomers ?? 0, icon: '🎯', color: 'purple' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/customers/new" className="btn btn-primary">➕ New Customer</Link>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.color}`}>
            <div className="stat-icon">{c.icon}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Customers */}
      <div className="card">
        <div className="tab-section-header">
          <h3>Recent Customers</h3>
          <Link to="/customers" className="btn btn-secondary btn-sm">View All →</Link>
        </div>

        {stats?.recentCustomers?.length > 0 ? (
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCustomers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/customers/${c.id}`} className="company-name">{c.companyName}</Link>
                    </td>
                    <td>{c.industry || '—'}</td>
                    <td>
                      <span className={`status-badge ${c.status?.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No customers yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
