import { api } from '@/lib/axios'

export const usersApi = {
  /** GET /api/Users/students-activation — response: { isSuccess, data: { items, pageNumber, totalPages, ... } } */
  getStudentsActivation: async (params = {}) => {
    const { data } = await api.get('/api/Users/students-activation', { params })
    return data.data
  },
  deactivateUser: async (userId) => {
    const { data } = await api.post(`/api/Users/${userId}/deactivate`)
    return data
  },
  reactivateUser: async (userId) => {
    const { data } = await api.post(`/api/Users/${userId}/reactivate`)
    return data
  }
}
