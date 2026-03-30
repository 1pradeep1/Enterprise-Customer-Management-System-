const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const response = await fetch(`${API_BASE}${url}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

const api = {
  // Customers
  getCustomers: (search, status) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    const qs = params.toString();
    return request(`/customers${qs ? '?' + qs : ''}`);
  },
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
  changeStatus: (id, status, changedBy) =>
    request(`/customers/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, changedBy }) }),

  // Contacts
  getContacts: (customerId) => request(`/customers/${customerId}/contacts`),
  addContact: (customerId, data) =>
    request(`/customers/${customerId}/contacts`, { method: 'POST', body: JSON.stringify(data) }),
  updateContact: (id, data) => request(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),

  // Addresses
  getAddresses: (customerId) => request(`/customers/${customerId}/addresses`),
  addAddress: (customerId, data) =>
    request(`/customers/${customerId}/addresses`, { method: 'POST', body: JSON.stringify(data) }),

  // Interactions
  getInteractions: (customerId) => request(`/customers/${customerId}/interactions`),
  addInteraction: (customerId, data) =>
    request(`/customers/${customerId}/interactions`, { method: 'POST', body: JSON.stringify(data) }),

  // Status History
  getStatusHistory: (customerId) => request(`/customers/${customerId}/status-history`),

  // Notes
  getNotes: (customerId) => request(`/customers/${customerId}/notes`),
  addNote: (customerId, data) =>
    request(`/customers/${customerId}/notes`, { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard
  getStats: () => request('/dashboard/stats'),
};

export default api;
