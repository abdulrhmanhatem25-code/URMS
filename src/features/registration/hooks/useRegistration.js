import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { registrationApi } from '../api/registrationApi'
import { useLanguageStore } from '@/app/store/useLanguageStore'
// Trigger HMR


export const usePendingStudents = (params = {}) => {
  return useQuery({
    queryKey: ['pending-students', params],
    queryFn: () => registrationApi.getPendingStudents(params),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  })
}

export const useApproveStudent = () => {
  const queryClient = useQueryClient()
  const { lang } = useLanguageStore()

  return useMutation({
    mutationFn: registrationApi.approveStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-students'] })
      alert(
        lang === 'ar' 
          ? 'تم تفعيل حساب الطالب بنجاح' 
          : 'Student account activated successfully'
      )
    },
    onError: (error) => {
      const message = error?.response?.data?.message || (lang === 'ar' ? 'حدث خطأ أثناء التفعيل' : 'Error activating account')
      alert(message)
    }
  })
}

export const useUpdateStudent = () => {
  const queryClient = useQueryClient()
  const { lang } = useLanguageStore()

  return useMutation({
    mutationFn: ({ studentId, data }) => registrationApi.updateStudent(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-students'] })
      alert(
        lang === 'ar' 
          ? 'تم تحديث بيانات الطالب بنجاح' 
          : 'Student details updated successfully'
      )
    },
    onError: (error) => {
      const message = error?.response?.data?.message || (lang === 'ar' ? 'حدث خطأ أثناء التحديث' : 'Error updating details')
      alert(message)
    }
  })
}
