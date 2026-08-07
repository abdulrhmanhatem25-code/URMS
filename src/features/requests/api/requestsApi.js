import { api } from '@/lib/axios'

export const requestsApi = {
  /** GET /api/forms/active — fetch only active forms for students */
  getForms: () => api.get('/api/forms/active').then(r => r.data),

  /**
   * POST /api/Requests
   * body: { formDefinitionId, additionalData: { [labelEn]: value } }
   */
  submitRequest: (body) => api.post('/api/Requests', body).then(r => r.data),

  /** GET /api/Requests/my — fetch logged-in user's own requests */
  getMyRequests: () => api.get('/api/Requests/my').then(r => r.data),

  /** GET /api/Requests — all requests (SuperAdmin + Secretary + AcademicAdvisor) */
  getRequests: () => api.get('/api/Requests').then(r => r.data),

  /** GET /api/Requests/statuses — list of all possible statuses */
  getStatuses: () => api.get('/api/Requests/statuses').then(r => r.data),

  /** POST /api/Requests/:id/advisor-review */
  advisorReview: (id, body) => api.post(`/api/Requests/${id}/advisor-review`, body).then(r => r.data),

  /** POST /api/Requests/:id/staff-confirm */
  staffConfirm: (id, body) => api.post(`/api/Requests/${id}/secretary-confirm`, body).then(r => r.data),

  /** POST /api/Requests/:id/admin-override */
  adminOverride: (id, body) => api.post(`/api/Requests/${id}/admin-override`, body).then(r => r.data),

  /** POST /api/Requests/:id/withdraw */
  withdrawRequest: (id) => api.post(`/api/Requests/${id}/withdraw`).then(r => r.data),
}
