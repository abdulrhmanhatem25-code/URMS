import { useState, useEffect } from 'react'
import Modal from '@/shared/components/Modal'
import FormInput from '@/shared/components/FormInput'
import { useUpdateStudent } from '../hooks/useRegistration'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { Save } from 'lucide-react'

export default function EditStudentModal({ isOpen, onClose, student }) {
  const { lang, dir } = useLanguageStore()
  const { mutate: updateStudent, isPending } = useUpdateStudent()

  const [formData, setFormData] = useState({
    fullNameAr: '',
    fullNameEn: '',
    email: '',
    universityCode: '',
    nationalId: '',
    phoneNumber: '',
    address: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        fullNameAr: student.fullNameAr || '',
        fullNameEn: student.fullNameEn || '',
        email: student.email || '',
        universityCode: student.universityCode || '',
        nationalId: student.nationalId || '',
        phoneNumber: student.phoneNumber || '',
        address: student.address || ''
      })
      setErrors({})
    }
  }, [student, isOpen])

  const validate = () => {
    const newErrors = {}
    if (!formData.fullNameAr) newErrors.fullNameAr = lang === 'ar' ? 'مطلوب' : 'Required'
    if (!formData.fullNameEn) newErrors.fullNameEn = lang === 'ar' ? 'مطلوب' : 'Required'
    if (!formData.email) newErrors.email = lang === 'ar' ? 'مطلوب' : 'Required'
    if (!formData.universityCode) newErrors.universityCode = lang === 'ar' ? 'مطلوب' : 'Required'
    if (!formData.phoneNumber) newErrors.phoneNumber = lang === 'ar' ? 'مطلوب' : 'Required'
    
    // National ID validation: must be 14 digits
    if (!formData.nationalId) {
      newErrors.nationalId = lang === 'ar' ? 'مطلوب' : 'Required'
    } else if (!/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = lang === 'ar' ? 'يجب أن يكون الرقم القومي 14 رقماً' : 'National ID must be 14 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    updateStudent({
      studentId: student.id,
      data: {
        id: student.id,
        ...formData
      }
    }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  if (!student) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'ar' ? 'تعديل بيانات الطالب' : 'Edit Student Details'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={lang === 'ar' ? 'الاسم باللغة العربية' : 'Full Name (Arabic)'}
            name="fullNameAr"
            value={formData.fullNameAr}
            onChange={handleChange}
            error={errors.fullNameAr}
            required
            dir="rtl"
          />
          <FormInput
            label={lang === 'ar' ? 'الاسم باللغة الإنجليزية' : 'Full Name (English)'}
            name="fullNameEn"
            value={formData.fullNameEn}
            onChange={handleChange}
            error={errors.fullNameEn}
            required
            dir="ltr"
          />
          <FormInput
            label={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            dir="ltr"
          />
          <FormInput
            label={lang === 'ar' ? 'كود الطالب (الجامعي)' : 'University Code'}
            name="universityCode"
            value={formData.universityCode}
            onChange={handleChange}
            error={errors.universityCode}
            required
            dir="ltr"
          />
          <FormInput
            label={lang === 'ar' ? 'الرقم القومي' : 'National ID'}
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            error={errors.nationalId}
            required
            maxLength={14}
            dir="ltr"
          />
          <FormInput
            label={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            required
            dir="ltr"
          />
          <div className="md:col-span-2">
            <FormInput
              label={lang === 'ar' ? 'العنوان' : 'Address'}
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-border bg-background hover:bg-secondary text-foreground transition-colors"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
