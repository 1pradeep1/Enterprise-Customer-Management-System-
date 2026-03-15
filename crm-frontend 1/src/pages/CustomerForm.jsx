import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function CustomerForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    status: 'PROSPECT',
    onboardingStage: 'NEW',
    email: '',
    phone: '',
    website: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.getCustomer(id)
        .then(c => setForm({
          companyName: c.companyName || '',
          industry: c.industry || '',
          status: c.status || 'PROSPECT',
          onboardingStage: c.onboardingStage || 'NEW',
          email: c.email || '',
          phone: c.phone || '',
          website: c.website || '',
        }))
        .catch(() => navigate('/customers'))
    }
  }, [id, isEdit])

  const validate = () => {
    const e = {}
    if (!form.companyName.trim()) e.companyName = 'Company name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (isEdit) {
        await api.updateCustomer(id, form)
        navigate(`/customers/${id}`)
      } else {
        const created = await api.createCustomer(form)
        navigate(`/customers/${created.id}`)
      }
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  const onChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Customer' : 'New Customer'}</h1>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="companyName">Company Name *</label>
            <input
              id="companyName"
              className="form-input"
              placeholder="Acme Corporation"
              value={form.companyName}
              onChange={onChange('companyName')}
            />
            {errors.companyName && <div className="form-error">{errors.companyName}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="industry">Industry</label>
              <input
                id="industry"
                className="form-input"
                placeholder="Technology"
                value={form.industry}
                onChange={onChange('industry')}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select id="status" className="form-select" value={form.status} onChange={onChange('status')}>
                <option value="PROSPECT">Prospect</option>
                <option value="ONBOARDING">Onboarding</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CHURNED">Churned</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="onboardingStage">Onboarding Stage</label>
              <select id="onboardingStage" className="form-select" value={form.onboardingStage} onChange={onChange('onboardingStage')}>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="PROPOSAL_SENT">Proposal Sent</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="contact@acme.com"
                value={form.email}
                onChange={onChange('email')}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={onChange('phone')}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="website">Website</label>
              <input
                id="website"
                className="form-input"
                placeholder="https://acme.com"
                value={form.website}
                onChange={onChange('website')}
              />
            </div>
          </div>

          {errors.submit && <div className="form-error" style={{ marginBottom: 16 }}>{errors.submit}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? '💾 Update Customer' : '🚀 Create Customer'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
