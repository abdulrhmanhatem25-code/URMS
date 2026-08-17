import { api } from '@/lib/axios'

export const adminFormsApi = {
  /** GET /api/admin/forms — response: { isSuccess, data: [...], errors } */
  getForms: () => api.get('/api/admin/forms').then(r => r.data.data),

  /** GET /api/admin/forms/:id — response: { isSuccess, data: {...}, errors } */
  getForm: (id) => api.get(`/api/admin/forms/${id}`).then(r => r.data.data),

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

  /** DELETE /api/admin/forms/:formId/fields/:fieldId */
  deleteField: (formId, fieldId) =>
    api.delete(`/api/admin/forms/${formId}/fields/${fieldId}`).then(r => r.data),

  /** POST /api/admin/forms/:formId/fields */
  addField: (formId, body) =>
    api.post(`/api/admin/forms/${formId}/fields`, body).then(r => r.data),
}
