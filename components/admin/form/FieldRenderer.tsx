'use client'

import type { FieldSchema, SelectFieldSchema } from '@/lib/admin/definitions'
import type { AdminForm } from '@/lib/admin/form'
import TextField     from './TextField'
import TextAreaField from './TextAreaField'
import NumberField   from './NumberField'
import SelectField   from './SelectField'
import RadioField    from './RadioField'
import CheckboxField from './CheckboxField'
import ToggleField   from './ToggleField'
import DateField     from './DateField'
import ColourField   from './ColourField'
import SlugField     from './SlugField'
import ImageField    from './ImageField'

type Props<T extends Record<string, unknown>> = {
  field:    FieldSchema
  form:     AdminForm<T>
  className?: string
}

/**
 * Renders the appropriate field component from a FieldSchema descriptor.
 * Wires value, onChange, error, and all common props automatically.
 */
export default function FieldRenderer<T extends Record<string, unknown>>({
  field, form, className,
}: Props<T>) {
  const key      = field.key as keyof T
  const rawValue = form.data[key]
  const error    = form.errors[key]
  const errStr   = typeof error === 'string' ? error : undefined

  function onChange(v: unknown) {
    form.set(key, v as T[keyof T])
  }

  const common = {
    label:       field.label,
    hint:        field.hint,
    required:    field.required,
    disabled:    field.disabled,
    error:       errStr,
    className,
  }

  switch (field.component) {
    case 'text':
      return (
        <TextField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : ''}
          onChange={onChange}
          placeholder={field.placeholder}
          type={field.type}
          maxLength={field.maxLength}
        />
      )

    case 'textarea':
      return (
        <TextAreaField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : ''}
          onChange={onChange}
          placeholder={field.placeholder}
          rows={field.rows}
          maxLength={field.maxLength}
        />
      )

    case 'number':
      return (
        <NumberField
          {...common}
          value={typeof rawValue === 'number' ? rawValue : ('' as number | '')}
          onChange={onChange as (v: number | '') => void}
          min={field.min}
          max={field.max}
          step={field.step}
          prefix={field.prefix}
          suffix={field.suffix}
        />
      )

    case 'select': {
      type Opt = Array<{ label: string; value: string }>
      const rawOptions = (field as SelectFieldSchema).options
      const options: Opt = typeof rawOptions === 'function'
        ? (rawOptions as () => Opt)()
        : rawOptions as Opt
      return (
        <SelectField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : ''}
          onChange={onChange}
          options={options}
          placeholder={field.placeholder}
        />
      )
    }

    case 'radio':
      return (
        <RadioField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : ''}
          onChange={onChange}
          options={field.options}
          layout={field.layout}
        />
      )

    case 'checkbox':
      return (
        <CheckboxField
          {...common}
          checked={typeof rawValue === 'boolean' ? rawValue : false}
          onChange={onChange}
          description={field.description}
        />
      )

    case 'toggle':
      return (
        <ToggleField
          {...common}
          checked={typeof rawValue === 'boolean' ? rawValue : false}
          onChange={onChange}
          description={field.description}
        />
      )

    case 'date':
    case 'datetime':
      return (
        <DateField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : ''}
          onChange={onChange}
          type={field.component === 'datetime' ? 'datetime-local' : 'date'}
          min={field.minDate}
          max={field.maxDate}
        />
      )

    case 'colour':
      return (
        <ColourField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : ''}
          onChange={onChange}
        />
      )

    case 'slug':
      return (
        <SlugField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : ''}
          onChange={onChange}
          prefix={field.prefix}
          autoSlugFrom={
            field.autoSlugFrom
              ? String(form.data[field.autoSlugFrom as keyof T] ?? '')
              : undefined
          }
        />
      )

    case 'image':
      return (
        <ImageField
          {...common}
          value={typeof rawValue === 'string' ? rawValue : null}
          onChange={onChange}
          aspect={field.aspect}
        />
      )

    default:
      return (
        <div className="text-xs text-red-500 p-2 border border-red-200 rounded">
          Unknown field component: {(field as FieldSchema).component}
        </div>
      )
  }
}
