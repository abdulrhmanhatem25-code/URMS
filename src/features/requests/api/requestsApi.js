import { api } from '@/lib/axios'

export const requestsApi = {
  /** GET /api/forms/active — response: { isSuccess, data: [...], errors } */
  getForms: () => api.get('/api/forms/active').then(r => r.data.data),

  /**
   * POST /api/Requests
   * body: { formDefinitionId, additionalData: { [labelEn]: value } }
   */
  submitRequest: (body) => api.post('/api/Requests', body).then(r => r.data),

  /** GET /api/Requests/my — response: { isSuccess, data: { items, pageNumber, totalPages, ... } } */
  getMyRequests: (params = {}) => api.get('/api/Requests/my', { params }).then(r => r.data.data),

  /** GET /api/Requests — response: { isSuccess, data: { items, pageNumber, totalPages, ... } } */
  getRequests: (params = {}) => api.get('/api/Requests', { params }).then(r => r.data.data),

  /** GET /api/Requests/statuses — response: { isSuccess, data: [...], errors } */
  getStatuses: () => api.get('/api/Requests/statuses').then(r => r.data.data),

  /** POST /api/Requests/:id/advisor-review */
  advisorReview: (id, body) => api.post(`/api/Requests/${id}/advisor-review`, body).then(r => r.data),

  /** POST /api/Requests/:id/staff-confirm */
  staffConfirm: (id, body) => api.post(`/api/Requests/${id}/secretary-confirm`, body).then(r => r.data),

  /** POST /api/Requests/:id/admin-override */
  adminOverride: (id, body) => api.post(`/api/Requests/${id}/admin-override`, body).then(r => r.data),

  /** POST /api/Requests/:id/withdraw */
  withdrawRequest: (id) => api.post(`/api/Requests/${id}/withdraw`).then(r => r.data),

  /** POST /api/Requests/:id/send-to-administration */
  sendToAdministration: (id, body) => api.post(`/api/Requests/${id}/send-to-administration`, body).then(r => r.data),

}

