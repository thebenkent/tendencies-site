import { cn } from '@/lib/utils'

type Props = {
  title?:       string
  description?: string
  children:     React.ReactNode
  className?:   string
  actions?:     React.ReactNode
}

export default function Section({ title, description, children, className, actions }: Props) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white overflow-hidden', className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0 ml-4">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
