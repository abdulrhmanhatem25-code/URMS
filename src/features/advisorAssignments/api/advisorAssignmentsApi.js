import { api } from '@/lib/axios'

export const advisorAssignmentsApi = {
  /**
   * GET /api/AdvisorAssignments/my-students
   * Returns the current advisor's assigned students with pagination and optional filtering.
   * @param {Object} params - { searchColumn, searchTerm, pageNumber, pageSize }
   */
  getMyStudents: async (params = {}) => {
    const { data } = await api.get('/api/AdvisorAssignments/my-students', { params })
    return data
  },
}
