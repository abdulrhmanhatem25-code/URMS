import { api } from '@/lib/axios'

export const admissionApi = {
  /**
   * GET /api/Requests/external/{token}
   * Fetch the admission request data using a one-time token.
   * No authentication required — token is the access key.
   */
  getExternalRequest: async (token) => {
    const { data } = await api.get(`/api/Requests/external/${token}`)
    return data
  },

  /**
   * POST /api/Requests/external/{token}/respond
   * Submit the administration decision for the request.
   * Body: { isApproved: boolean, notes: string, otp: string }
   */
  respondToRequest: async (token, body) => {
    const { data } = await api.post(`/api/Requests/external/${token}/respond`, body)
    return data
  },

  /**
   * POST /api/Requests/{id}/send-to-administration
   * Send a request to the external administration (triggers the email with the magic link).
   * The request ID is sent in the URL.
   */
  sendToAdministration: async (id, body) => {
    const { data } = await api.post(`/api/Requests/${id}/send-to-administration`, body)
    return data
  },

}
