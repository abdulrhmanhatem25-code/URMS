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
}
