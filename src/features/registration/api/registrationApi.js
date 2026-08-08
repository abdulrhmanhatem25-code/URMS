import { api } from '@/lib/axios' // force update

export const registrationApi = {
  getPendingStudents: async () => {
    const { data } = await api.get('/api/Users/pending-students')
    return data
  },
  approveStudent: async (studentId) => {
    const { data } = await api.post(`/api/Users/${studentId}/approve`)
    return data
  },
  updateStudent: async (studentId, studentData) => {
    const { data } = await api.put(`/api/Users/${studentId}`, studentData)
    return data
  }
}
