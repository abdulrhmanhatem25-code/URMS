import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Shared form input with label and error message
 */
const FormInput = React.forwardRef(function FormInput(
  { label, error, dir, className, required, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive mr-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        dir={dir}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-lg bg-input/40 border text-sm text-foreground',
          'placeholder:text-muted-foreground/50 outline-none transition-all duration-150',
          'focus:ring-2 focus:ring-ring/30',
          error
            ? 'border-destructive focus:border-destructive'
            : 'border-border focus:border-primary',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

export default FormInput
