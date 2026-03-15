import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchCustomers = () => {
    setLoading(true)
    api.getCustomers(search, statusFilter)
      .then(setCustomers)
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCustomers()
  }, [statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCustomers()
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    try {
      await api.deleteCustomer(id)
      setCustomers(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">➕ Add Customer</Link>
      </div>

      {/* Search & Filter */}
      <div className="search-bar-wrapper">
        <form onSubmit={handleSearch} className="search-container" style={{ flex: 1, maxWidth: 400 }}>
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search by company or industry..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        <select
          id="status-filter"
          className="form-select"
          style={{ width: 180 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="PROSPECT">Prospect</option>
          <option value="ONBOARDING">Onboarding</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="CHURNED">Churned</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="spinner" />
      ) : customers.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <p>No customers found. Try a different search or add a new customer.</p>
          </div>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Stage</th>
                <th>Email</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <span
                      className="company-name"
                      onClick={() => navigate(`/customers/${c.id}`)}
                    >
                      {c.companyName}
                    </span>
                  </td>
                  <td>{c.industry || '—'}</td>
                  <td>
                    <span className={`status-badge ${c.status?.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.onboardingStage || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.email || '—'}</td>
                  <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/customers/${c.id}/edit`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c.id, c.companyName)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
