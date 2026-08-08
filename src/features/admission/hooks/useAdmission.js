import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { admissionApi } from '../api/admissionApi'

/**
 * Fetch the admission request details using a one-time token.
 * retry: false — don't retry on failure (token may be invalid/used).
 */
export const useExternalRequest = (token) => {
  return useQuery({
    queryKey: ['external-request', token],
    queryFn: () => admissionApi.getExternalRequest(token),
    enabled: !!token,
    retry: false,
  })
}

/**
 * Submit the administration decision (approve/reject) using the token.
 * Body: { isApproved: boolean, notes: string, otp: string }
 */
export const useRespondToRequest = (token) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body) => admissionApi.respondToRequest(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-request', token] })
    },
  })
}

/**
 * Send a request to the external administration via email (magic link).
 * Used inside the normal requests view (by SuperAdmin/Secretary).
 */
export const useSendToAdministration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: admissionApi.sendToAdministration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-requests'] })
    },
  })
}
