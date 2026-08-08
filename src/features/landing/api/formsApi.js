import { api } from '@/lib/axios'

export const formsApi = {
  /** GET /api/forms/summaries — public, no auth required */
  getForms: async () => {
    const { data } = await api.get('/api/forms/summaries')
    return data
  },
}
