import { useQuery } from '@tanstack/react-query'
import { advisorAssignmentsApi } from '../api/advisorAssignmentsApi'

/**
 * Fetch the current advisor's assigned students.
 * Supports search (searchColumn + searchTerm) and pagination.
 *
 * @param {Object} params - { searchColumn, searchTerm, pageNumber, pageSize }
 */
export const useMyStudents = (params = {}) => {
  return useQuery({
    queryKey: ['advisor-my-students', params],
    queryFn: () => advisorAssignmentsApi.getMyStudents(params),
    keepPreviousData: true,   // smooth page transitions
    staleTime: 1000 * 30,    // 30s before re-fetch
  })
}
