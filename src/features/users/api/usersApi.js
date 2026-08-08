import { api } from '@/lib/axios'

export const usersApi = {
  getStudentsActivation: async () => {
    const { data } = await api.get('/api/Users/students-activation')
    return data
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
