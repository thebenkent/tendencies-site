import { cn } from '@/lib/utils'

type Crumb = { label: string; href?: string }

type Props = {
  title:       string
  description?: string
  breadcrumbs?: Crumb[]
  actions?:    React.ReactNode
  className?:  string
}

export default function PageHeader({ title, description, breadcrumbs, actions, className }: Props) {
  return (
    <div className={cn('px-6 py-5 border-b border-gray-200 bg-white', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-3 text-xs text-gray-400">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-gray-600 transition-colors">{crumb.label}</a>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span className="text-gray-300">/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
}
