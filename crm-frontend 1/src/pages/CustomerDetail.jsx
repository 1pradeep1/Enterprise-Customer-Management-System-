import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'

const TABS = ['Profile', 'Contacts', 'Addresses', 'Interactions', 'Notes', 'Status History']

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [tab, setTab] = useState('Profile')
  const [contacts, setContacts] = useState([])
  const [addresses, setAddresses] = useState([])
  const [interactions, setInteractions] = useState([])
  const [notes, setNotes] = useState([])
  const [statusHistory, setStatusHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'contact' | 'address' | 'interaction' | 'note' | 'status'

  useEffect(() => {
    api.getCustomer(id)
      .then(setCustomer)
      .catch(() => navigate('/customers'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!customer) return
    if (tab === 'Contacts') api.getContacts(id).then(setContacts)
    else if (tab === 'Addresses') api.getAddresses(id).then(setAddresses)
    else if (tab === 'Interactions') api.getInteractions(id).then(setInteractions)
    else if (tab === 'Notes') api.getNotes(id).then(setNotes)
    else if (tab === 'Status History') api.getStatusHistory(id).then(setStatusHistory)
  }, [tab, customer])

  if (loading) return <div className="spinner" />
  if (!customer) return null

  const initials = customer.companyName
    ?.split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '??'

  return (
    <div>
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/customers')}>← Back to Customers</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/customers/${id}/edit`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal('status')}>🔄 Change Status</button>
        </div>
      </div>

      <div className="detail-title" style={{ marginBottom: 24 }}>
        <div className="customer-avatar">{initials}</div>
        <div className="detail-info">
          <h2>{customer.companyName}</h2>
          <span className="industry-label">{customer.industry || 'No industry'}</span>
          &nbsp;&nbsp;
          <span className={`status-badge ${customer.status?.toLowerCase()}`}>{customer.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'Profile' && <ProfileTab customer={customer} />}
      {tab === 'Contacts' && (
        <ListSection
          title="Contacts"
          items={contacts}
          onAdd={() => setModal('contact')}
          renderItem={c => (
            <div className="item-card" key={c.id}>
              <div className="item-title">{c.firstName} {c.lastName} {c.isPrimary && '⭐'}</div>
              <div className="item-meta">{c.role || 'No role'} · {c.email || 'No email'} · {c.phone || 'No phone'}</div>
            </div>
          )}
          emptyMsg="No contacts yet"
        />
      )}
      {tab === 'Addresses' && (
        <ListSection
          title="Addresses"
          items={addresses}
          onAdd={() => setModal('address')}
          renderItem={a => (
            <div className="item-card" key={a.id}>
              <div className="item-title">{a.type || 'Address'}</div>
              <div className="item-meta">{a.street}, {a.city}{a.state ? ', ' + a.state : ''} {a.zipCode || ''} {a.country || ''}</div>
            </div>
          )}
          emptyMsg="No addresses yet"
        />
      )}
      {tab === 'Interactions' && (
        <ListSection
          title="Interactions"
          items={interactions}
          onAdd={() => setModal('interaction')}
          renderItem={i => (
            <div className="item-card" key={i.id}>
              <div className="item-title">{i.subject}</div>
              <div className="item-meta">{i.type} · {i.interactionDate ? new Date(i.interactionDate).toLocaleString() : ''}</div>
              {i.description && <div className="item-body">{i.description}</div>}
            </div>
          )}
          emptyMsg="No interactions yet"
        />
      )}
      {tab === 'Notes' && (
        <ListSection
          title="Notes"
          items={notes}
          onAdd={() => setModal('note')}
          renderItem={n => (
            <div className="item-card" key={n.id}>
              <div className="item-title">{n.title}</div>
              <div className="item-meta">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
              {n.content && <div className="item-body">{n.content}</div>}
            </div>
          )}
          emptyMsg="No notes yet"
        />
      )}
      {tab === 'Status History' && (
        <StatusTimeline history={statusHistory} />
      )}

      {/* Modals */}
      {modal === 'contact' && (
        <ContactModal
          customerId={id}
          onClose={() => setModal(null)}
          onSaved={c => { setContacts(prev => [...prev, c]); setModal(null) }}
        />
      )}
      {modal === 'address' && (
        <AddressModal
          customerId={id}
          onClose={() => setModal(null)}
          onSaved={a => { setAddresses(prev => [...prev, a]); setModal(null) }}
        />
      )}
      {modal === 'interaction' && (
        <InteractionModal
          customerId={id}
          onClose={() => setModal(null)}
          onSaved={i => { setInteractions(prev => [i, ...prev]); setModal(null) }}
        />
      )}
      {modal === 'note' && (
        <NoteModal
          customerId={id}
          onClose={() => setModal(null)}
          onSaved={n => { setNotes(prev => [n, ...prev]); setModal(null) }}
        />
      )}
      {modal === 'status' && (
        <StatusModal
          customerId={id}
          current={customer.status}
          onClose={() => setModal(null)}
          onSaved={updated => {
            setCustomer(updated)
            setModal(null)
            if (tab === 'Status History') api.getStatusHistory(id).then(setStatusHistory)
          }}
        />
      )}
    </div>
  )
}

/* ===== Sub Components ===== */

function ProfileTab({ customer }) {
  return (
    <div className="card">
      <div className="info-grid">
        <InfoItem label="Company Name" value={customer.companyName} />
        <InfoItem label="Industry" value={customer.industry} />
        <InfoItem label="Status" value={customer.status} />
        <InfoItem label="Onboarding Stage" value={customer.onboardingStage} />
        <InfoItem label="Email" value={customer.email} />
        <InfoItem label="Phone" value={customer.phone} />
        <InfoItem label="Website" value={customer.website} />
        <InfoItem label="Created" value={customer.createdAt ? new Date(customer.createdAt).toLocaleString() : '—'} />
        <InfoItem label="Last Updated" value={customer.updatedAt ? new Date(customer.updatedAt).toLocaleString() : '—'} />
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className="info-value">{value || '—'}</span>
    </div>
  )
}

function ListSection({ title, items, onAdd, renderItem, emptyMsg }) {
  return (
    <div>
      <div className="tab-section-header">
        <h3>{title} ({items.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>➕ Add {title.slice(0, -1)}</button>
      </div>
      {items.length > 0 ? items.map(renderItem) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>{emptyMsg}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusTimeline({ history }) {
  if (!history.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <p>No status changes recorded</p>
        </div>
      </div>
    )
  }
  return (
    <div className="card">
      <div className="timeline">
        {history.map(h => (
          <div className="timeline-item" key={h.id}>
            <div className="timeline-content">
              <span className={`status-badge ${h.oldStatus?.toLowerCase()}`}>{h.oldStatus || 'NONE'}</span>
              {' → '}
              <span className={`status-badge ${h.newStatus?.toLowerCase()}`}>{h.newStatus}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '0.8rem' }}>by {h.changedBy}</span>
            </div>
            <div className="timeline-date">{h.changedAt ? new Date(h.changedAt).toLocaleString() : ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===== Modals ===== */

function ContactModal({ customerId, onClose, onSaved }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', role: '', isPrimary: false })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const c = await api.addContact(customerId, form)
      onSaved(c)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Contact</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input className="form-input" required value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input className="form-input" required value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-input" placeholder="e.g. CTO, Manager" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Contact'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddressModal({ customerId, onClose, onSaved }) {
  const [form, setForm] = useState({ type: 'Office', street: '', city: '', state: '', zipCode: '', country: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const a = await api.addAddress(customerId, form)
      onSaved(a)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Address</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="Office">Office</option>
                <option value="Billing">Billing</option>
                <option value="Shipping">Shipping</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Street *</label>
              <input className="form-input" required value={form.street} onChange={e => setForm(p => ({ ...p, street: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input className="form-input" value={form.zipCode} onChange={e => setForm(p => ({ ...p, zipCode: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Address'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InteractionModal({ customerId, onClose, onSaved }) {
  const [form, setForm] = useState({ type: 'CALL', subject: '', description: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const i = await api.addInteraction(customerId, form)
      onSaved(i)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log Interaction</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="CALL">Call</option>
                  <option value="EMAIL">Email</option>
                  <option value="MEETING">Meeting</option>
                  <option value="DEMO">Demo</option>
                  <option value="SUPPORT">Support</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input className="form-input" required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Log Interaction'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function NoteModal({ customerId, onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const n = await api.addNote(customerId, form)
      onSaved(n)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Note</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-textarea" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Note'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function StatusModal({ customerId, current, onClose, onSaved }) {
  const [status, setStatus] = useState(current)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === current) { onClose(); return }
    setSaving(true)
    try {
      const updated = await api.changeStatus(customerId, status, 'ADMIN')
      onSaved(updated)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Status</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Current Status</label>
              <span className={`status-badge ${current?.toLowerCase()}`}>{current}</span>
            </div>
            <div className="form-group">
              <label className="form-label">New Status</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="PROSPECT">Prospect</option>
                <option value="ONBOARDING">Onboarding</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CHURNED">Churned</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Status'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
