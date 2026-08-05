import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import { useRegister } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import FormInput from '@/shared/components/FormInput'

// ─── Validation Schema ────────────────────────────────────────────────────────
const schema = z.object({
  // Arabic name
  firstNameAr: z.string().min(2, 'الاسم الأول مطلوب'),
  secondNameAr: z.string().min(2, 'الاسم الثاني مطلوب'),
  thirdNameAr: z.string().optional().default(''),
  lastNameAr: z.string().min(2, 'اسم العائلة مطلوب'),
  // English name
  firstNameEn: z.string().min(2, 'First name is required'),
  secondNameEn: z.string().min(2, 'Second name is required'),
  thirdNameEn: z.string().optional().default(''),
  lastNameEn: z.string().min(2, 'Last name is required'),
  // Personal & account
  universityCode: z.string().min(1, 'الكود الجامعي مطلوب'),
  nationalId: z
    .string()
    .length(14, 'الرقم القومي يجب أن يكون 14 رقماً')
    .regex(/^\d+$/, 'أرقام فقط'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phoneNumber: z
    .string()
    .min(10, 'رقم الهاتف غير صحيح')
    .regex(/^\d+$/, 'أرقام فقط'),
  alternatePhone: z.string().optional().default(''),
  address: z.string().min(5, 'العنوان مطلوب'),
  password: z
    .string()
    .min(8, 'كلمة المرور 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم')
    .regex(/[!@#$%^&*]/, 'يجب أن تحتوي على رمز خاص (!@#$%^&*)'),
})

// Fields validated per step
const STEP_FIELDS = {
  1: ['firstNameAr', 'secondNameAr', 'thirdNameAr', 'lastNameAr'],
  2: ['firstNameEn', 'secondNameEn', 'thirdNameEn', 'lastNameEn'],
  3: [
    'universityCode',
    'nationalId',
    'email',
    'phoneNumber',
    'alternatePhone',
    'address',
    'password',
  ],
}

export default function RegisterForm({ step, setStep, onSuccess }) {
  const [showPass, setShowPass] = useState(false)
  const { mutate: register, isPending, error } = useRegister()

  const {
    register: field,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { thirdNameAr: '', thirdNameEn: '', alternatePhone: '' },
    mode: 'onTouched',
  })

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = (data) => {
    register(data, { onSuccess })
  }

  const apiError =
    error?.response?.data?.message ||
    (error ? 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى' : null)

  // ── Step 1: Arabic Name ──────────────────────────────────────────────────
  const Step1 = (
    <div className="space-y-4" dir="rtl">
      <p className="text-sm text-muted-foreground">
        أدخل اسمك الرباعي باللغة العربية كما هو في بطاقة الرقم القومي
      </p>
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="الاسم الأول"
          required
          placeholder="محمد"
          error={errors.firstNameAr?.message}
          {...field('firstNameAr')}
        />
        <FormInput
          label="الاسم الثاني"
          required
          placeholder="أحمد"
          error={errors.secondNameAr?.message}
          {...field('secondNameAr')}
        />
        <FormInput
          label="الاسم الثالث"
          placeholder="علي"
          error={errors.thirdNameAr?.message}
          {...field('thirdNameAr')}
        />
        <FormInput
          label="اسم العائلة"
          required
          placeholder="الشريف"
          error={errors.lastNameAr?.message}
          {...field('lastNameAr')}
        />
      </div>
    </div>
  )

  // ── Step 2: English Name ─────────────────────────────────────────────────
  const Step2 = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground" dir="rtl">
        أدخل اسمك بالإنجليزية كما هو في بطاقة الرقم القومي
      </p>
      <div className="grid grid-cols-2 gap-4" dir="ltr">
        <FormInput
          label="First Name"
          required
          placeholder="Mohamed"
          dir="ltr"
          error={errors.firstNameEn?.message}
          {...field('firstNameEn')}
        />
        <FormInput
          label="Second Name"
          required
          placeholder="Ahmed"
          dir="ltr"
          error={errors.secondNameEn?.message}
          {...field('secondNameEn')}
        />
        <FormInput
          label="Third Name"
          placeholder="Ali"
          dir="ltr"
          error={errors.thirdNameEn?.message}
          {...field('thirdNameEn')}
        />
        <FormInput
          label="Last Name"
          required
          placeholder="El-Sharif"
          dir="ltr"
          error={errors.lastNameEn?.message}
          {...field('lastNameEn')}
        />
      </div>
    </div>
  )

  // ── Step 3: Account Details ──────────────────────────────────────────────
  const Step3 = (
    <div className="space-y-4" dir="rtl">
      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm text-center">
          {apiError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="الكود الجامعي"
          required
          placeholder="20211234"
          error={errors.universityCode?.message}
          {...field('universityCode')}
        />
        <FormInput
          label="الرقم القومي"
          required
          placeholder="30001012345678"
          maxLength={14}
          error={errors.nationalId?.message}
          {...field('nationalId')}
        />
      </div>
      <FormInput
        label="البريد الإلكتروني"
        required
        type="email"
        placeholder="example@gmail.com"
        dir="ltr"
        error={errors.email?.message}
        {...field('email')}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="رقم الهاتف"
          required
          placeholder="01012345678"
          error={errors.phoneNumber?.message}
          {...field('phoneNumber')}
        />
        <FormInput
          label="هاتف بديل"
          placeholder="01012345678"
          error={errors.alternatePhone?.message}
          {...field('alternatePhone')}
        />
      </div>
      <FormInput
        label="العنوان"
        required
        placeholder="المدينة، المحافظة"
        error={errors.address?.message}
        {...field('address')}
      />

      {/* Password with show/hide */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          كلمة المرور
          <span className="text-destructive mr-0.5">*</span>
        </label>
        <div className="relative">
          <input
            {...field('password')}
            type={showPass ? 'text' : 'password'}
            placeholder="P@ssword123"
            dir="ltr"
            autoComplete="new-password"
            className={[
              'w-full pr-4 pl-10 py-2.5 rounded-lg bg-input/40 border text-sm text-foreground',
              'placeholder:text-muted-foreground/40 outline-none transition-all duration-150',
              'focus:ring-2 focus:ring-ring/30',
              errors.password
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-primary',
            ].join(' ')}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPass((p) => !p)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-destructive flex items-center gap-1">
            <span>⚠</span> {errors.password.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            8+ أحرف، حرف كبير، رقم، ورمز خاص (!@#$%^&*)
          </p>
        )}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Step content */}
      <div className="mb-6">
        {step === 1 && Step1}
        {step === 2 && Step2}
        {step === 3 && Step3}
      </div>

      {/* Navigation */}
      <div className="flex gap-3" dir="rtl">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setStep((s) => s - 1)}
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </Button>
        )}
        {step < 3 ? (
          <Button
            type="button"
            className="flex-1 gap-2"
            onClick={handleNext}
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="submit" className="flex-1 gap-2" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري إرسال البيانات...
              </>
            ) : (
              'إرسال طلب التسجيل'
            )}
          </Button>
        )}
      </div>
    </form>
  )
}
