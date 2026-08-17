import { api } from '@/lib/axios'

export const formsApi = {
  /** GET /api/forms/summaries — response: { isSuccess, data: [...], errors } */
  getForms: async () => {
    const { data } = await api.get('/api/forms/summaries')
    return data.data
  },
}
