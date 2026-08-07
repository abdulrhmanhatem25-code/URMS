import { useQuery, useMutation } from '@tanstack/react-query'
import { requestsApi } from '../api/requestsApi'

const FORMS_KEY = ['student-public-forms']
const MY_REQUESTS_KEY = ['student-my-requests']
const ALL_REQUESTS_KEY = ['admin-all-requests']

export function usePublicForms() {
  return useQuery({
    queryKey: FORMS_KEY,
    queryFn: requestsApi.getForms,
  })
}

export function useSubmitRequest() {
  return useMutation({
    mutationFn: (body) => requestsApi.submitRequest(body),
  })
}

export function useMyRequests() {
  return useQuery({
    queryKey: MY_REQUESTS_KEY,
    queryFn: requestsApi.getMyRequests,
  })
}

export function useAllRequests() {
  return useQuery({
    queryKey: ALL_REQUESTS_KEY,
    queryFn: requestsApi.getRequests,
  })
}
