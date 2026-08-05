import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminFormsApi } from '../api/adminFormsApi'

const FORMS_KEY = ['admin-forms']
const formKey = (id) => ['admin-form', id]

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useAdminForms() {
  return useQuery({
    queryKey: FORMS_KEY,
    queryFn: adminFormsApi.getForms,
  })
}

export function useAdminForm(id) {
  return useQuery({
    queryKey: formKey(id),
    queryFn: () => adminFormsApi.getForm(id),
    enabled: !!id,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => adminFormsApi.createForm(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: FORMS_KEY }),
  })
}

export function useToggleForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive, closedReasonMessage }) =>
      adminFormsApi.toggleForm(id, { isActive, closedReasonMessage }),
    onSuccess: () => qc.invalidateQueries({ queryKey: FORMS_KEY }),
  })
}

export function useUpdateForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }) => adminFormsApi.updateForm(id, body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: FORMS_KEY })
      qc.invalidateQueries({ queryKey: formKey(variables.id) })
    },
  })
}

export function useDeleteForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminFormsApi.deleteForm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: FORMS_KEY }),
  })
}

export function useDeleteField() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fieldId) => adminFormsApi.deleteField(fieldId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FORMS_KEY })
    },
  })
}
