import { api } from '@/lib/axios'

export const formsApi = {
  /** GET /api/admin/forms — public, no auth required */
  getForms: async () => {
    const { data } = await api.get('/api/admin/forms')
    return data
  },
}
