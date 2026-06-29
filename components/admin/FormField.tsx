import { cn } from '@/lib/utils'

type Props = {
  label:      string
  htmlFor?:   string
  hint?:      string
  error?:     string
  required?:  boolean
  children:   React.ReactNode
  className?: string
  horizontal?: boolean
}

export default function FormField({
  label, htmlFor, hint, error, required, children, className, horizontal = false,
}: Props) {
  if (horizontal) {
    return (
      <div className={cn('flex gap-6 py-4 border-b border-gray-100 last:border-0', className)}>
        <div className="w-48 flex-shrink-0 pt-1.5">
          <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
        </div>
        <div className="flex-1">
          {children}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
