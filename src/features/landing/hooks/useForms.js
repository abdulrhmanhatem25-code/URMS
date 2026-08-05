import { useQuery } from '@tanstack/react-query'
import { formsApi } from '../api/formsApi'

export function useForms() {
  return useQuery({
    queryKey: ['public-forms'],
    queryFn: formsApi.getForms,
    staleTime: 1000 * 60 * 5, // cache 5 minutes
  })
}
