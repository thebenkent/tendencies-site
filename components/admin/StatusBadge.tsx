import { cn } from '@/lib/utils'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error:   'bg-red-50 text-red-700 border-red-200',
  info:    'bg-blue-50 text-blue-700 border-blue-200',
  muted:   'bg-slate-50 text-slate-500 border-slate-200',
}

const DOT_CLASSES: Record<Variant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
  info:    'bg-blue-500',
  muted:   'bg-slate-400',
}

type Props = {
  label:    string
  variant?: Variant
  dot?:     boolean
  className?: string
}

export function statusVariant(status: string): Variant {
  switch (status) {
    case 'open':
    case 'active':
    case 'paid':
    case 'completed':
    case 'success':
      return 'success'
    case 'draft':
    case 'reserved':
      return 'muted'
    case 'closing_soon':
    case 'payment_requested':
    case 'production':
      return 'warning'
    case 'closed':
    case 'cancelled':
    case 'refunded':
    case 'error':
    case 'failed':
      return 'error'
    case 'confirmed':
    case 'info':
      return 'info'
    default:
      return 'default'
  }
}

export default function StatusBadge({ label, variant = 'default', dot = false, className }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
      VARIANT_CLASSES[variant],
      className,
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', DOT_CLASSES[variant])} />}
      {label}
    </span>
  )
}
