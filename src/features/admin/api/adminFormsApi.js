import { api } from '@/lib/axios'

export const adminFormsApi = {
  /** GET /api/admin/forms */
  getForms: () => api.get('/api/admin/forms').then(r => r.data),

  /** GET /api/admin/forms/:id */
  getForm: (id) => api.get(`/api/admin/forms/${id}`).then(r => r.data),

  /** POST /api/admin/forms */
  createForm: (body) => api.post('/api/admin/forms', body).then(r => r.data),

  /** PATCH /api/admin/forms/:id/toggle  { isActive, closedReasonMessage } */
  toggleForm: (id, body) =>
    api.patch(`/api/admin/forms/${id}/toggle`, body).then(r => r.data),

  /** PUT /api/admin/forms/:id */
  updateForm: (id, body) =>
    api.put(`/api/admin/forms/${id}`, body).then(r => r.data),

  /** DELETE /api/admin/forms/:id */
  deleteForm: (id) =>
    api.delete(`/api/admin/forms/${id}`).then(r => r.data),

  /** DELETE /api/admin/forms/fileds/:fieldId  (note: API typo "fileds") */
  deleteField: (fieldId) =>
    api.delete(`/api/admin/forms/fileds/${fieldId}`).then(r => r.data),
}
