import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import { useLanguageStore } from '@/app/store/useLanguageStore'

export const useStudentsActivation = () => {
  return useQuery({
    queryKey: ['students-activation'],
    queryFn: usersApi.getStudentsActivation
  })
}

export const useDeactivateUser = () => {
  const queryClient = useQueryClient()
  const { lang } = useLanguageStore()

  return useMutation({
    mutationFn: usersApi.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students-activation'] })
      alert(lang === 'ar' ? 'تم إلغاء تفعيل الحساب بنجاح' : 'Account deactivated successfully')
    },
    onError: (error) => {
      const message = error?.response?.data?.message || (lang === 'ar' ? 'حدث خطأ أثناء إلغاء التفعيل' : 'Error deactivating account')
      alert(message)
    }
  })
}

export const useReactivateUser = () => {
  const queryClient = useQueryClient()
  const { lang } = useLanguageStore()

  return useMutation({
    mutationFn: usersApi.reactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students-activation'] })
      alert(lang === 'ar' ? 'تم إعادة تفعيل الحساب بنجاح' : 'Account reactivated successfully')
    },
    onError: (error) => {
      const message = error?.response?.data?.message || (lang === 'ar' ? 'حدث خطأ أثناء إعادة التفعيل' : 'Error reactivating account')
      alert(message)
    }
  })
}
