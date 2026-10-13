// API service client for SRM CampusPulse
const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('campuspulse_token');
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  getUsers: () => request('/auth/users'),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  quickSwitch: (userId) => request('/auth/quick-switch', { method: 'POST', body: JSON.stringify({ userId }) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/events${query ? `?${query}` : ''}`);
  },
  getEventById: (id) => request(`/events/${id}`),
  createEvent: (eventData) => request('/events', { method: 'POST', body: JSON.stringify(eventData) }),
  updateEvent: (id, updates) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  submitForApproval: (id) => request(`/events/${id}/submit-approval`, { method: 'POST' }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Conflicts
  checkConflicts: (data) => request('/conflicts/check', { method: 'POST', body: JSON.stringify(data) }),
  getVenues: () => request('/conflicts/venues'),

  // Registrations & Ticketing
  registerForEvent: (data) => request('/registrations', { method: 'POST', body: JSON.stringify(data) }),
  getMyRegistrations: (userId) => request(`/registrations/my?userId=${userId}`),
  getEventAttendees: (eventId) => request(`/registrations/event/${eventId}`),
  checkInTicket: (data) => request('/registrations/check-in', { method: 'POST', body: JSON.stringify(data) }),
  cancelRegistration: (id) => request(`/registrations/cancel/${id}`, { method: 'POST' }),

  // Certificates
  getCertificates: (userId) => request(`/certificates/my?userId=${userId}`),
  getCertificateById: (id) => request(`/certificates/${id}`),

  // Notifications
  getNotifications: (userId) => request(`/notifications/my?userId=${userId}`),
  markNotificationRead: (id) => request(`/notifications/mark-read/${id}`, { method: 'POST' }),
  markAllNotificationsRead: (userId) => request('/notifications/mark-all-read', { method: 'POST', body: JSON.stringify({ userId }) }),

  // Payments
  createPaymentOrder: (data) => request('/payments/create-order', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (data) => request('/payments/verify', { method: 'POST', body: JSON.stringify(data) }),

  // Admin Workflow
  getPendingEvents: () => request('/admin/pending'),
  approveEvent: (id, data) => request(`/admin/approve/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  rejectEvent: (id, data) => request(`/admin/reject/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  getApprovalHistory: () => request('/admin/history'),
  resetDemoData: () => request('/admin/reset', { method: 'POST' }),

  // AI Poster Extraction
  getAIPresets: () => request('/ai/presets'),
  extractPoster: (formData) => request('/ai/extract-poster', { method: 'POST', body: formData }),

  // Analytics
  getAnalyticsOverview: () => request('/analytics/overview')
};
