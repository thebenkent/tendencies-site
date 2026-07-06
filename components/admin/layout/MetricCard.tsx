import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Trend = {
  value:     number   // percentage, can be negative
  label?:    string   // e.g. "vs last month"
}

type Props = {
  label:      string
  value:      string | number
  icon?:      ReactNode
  trend?:     Trend
  className?: string
  suffix?:    string
}

export default function MetricCard({ label, value, icon, trend, className, suffix }: Props) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white px-5 py-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 leading-none">
        {value}{suffix && <span className="text-base font-medium text-gray-500 ml-1">{suffix}</span>}
      </p>
      {trend && (
        <p className={cn('mt-1.5 text-xs font-medium', trend.value >= 0 ? 'text-green-600' : 'text-red-500')}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          {trend.label && <span className="text-gray-400 font-normal ml-1">{trend.label}</span>}
        </p>
      )}
    </div>
  )
}
