import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useGetStatuses() {
  return useQuery({
    queryKey: ['request-statuses'],
    queryFn: requestsApi.getStatuses,
  })
}

export function useAdvisorReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => requestsApi.advisorReview(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALL_REQUESTS_KEY })
      qc.invalidateQueries({ queryKey: MY_REQUESTS_KEY })
    },
  })
}

export function useStaffConfirm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => requestsApi.staffConfirm(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALL_REQUESTS_KEY })
      qc.invalidateQueries({ queryKey: MY_REQUESTS_KEY })
    },
  })
}

export function useAdminOverride() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => requestsApi.adminOverride(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALL_REQUESTS_KEY })
      qc.invalidateQueries({ queryKey: MY_REQUESTS_KEY })
    },
  })
}

export function useWithdrawRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => requestsApi.withdrawRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALL_REQUESTS_KEY })
      qc.invalidateQueries({ queryKey: MY_REQUESTS_KEY })
    },
  })
}

export function useSendToAdministration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => requestsApi.sendToAdministration(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALL_REQUESTS_KEY })
    },
  })
}
