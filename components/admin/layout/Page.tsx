import { cn } from '@/lib/utils'

type Props = {
  children:    React.ReactNode
  className?:  string
  noPadding?:  boolean   // for pages that manage their own padding (e.g. with sticky table)
}

export default function Page({ children, className, noPadding }: Props) {
  return (
    <div className={cn('flex flex-col flex-1 min-h-0', !noPadding && 'p-6', className)}>
      {children}
    </div>
  )
}
