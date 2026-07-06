'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export type FormErrors<T> = Partial<Record<keyof T, string>>

export type AdminForm<T> = {
  data:      T
  errors:    FormErrors<T>
  dirty:     boolean
  set:       <K extends keyof T>(key: K, value: T[K]) => void
  setMany:   (patch: Partial<T>) => void
  setError:  (key: keyof T, message: string) => void
  setErrors: (errs: FormErrors<T>) => void
  clearError:(key: keyof T) => void
  reset:     () => void
  hasError:  (key: keyof T) => boolean
}

export function useAdminForm<T extends Record<string, unknown>>(
  initial: T,
): AdminForm<T> {
  const initialRef = useRef(initial)
  const [data,   setData]   = useState<T>(initial)
  const [errors, setErrs]   = useState<FormErrors<T>>({})
  const [dirty,  setDirty]  = useState(false)

  // Reset when the initial identity changes (different row selected)
  useEffect(() => {
    if (initial !== initialRef.current) {
      initialRef.current = initial
      setData(initial)
      setErrs({})
      setDirty(false)
    }
  }, [initial])

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
    setErrs((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const setMany = useCallback((patch: Partial<T>) => {
    setData((prev) => ({ ...prev, ...patch }))
    setDirty(true)
  }, [])

  const setError = useCallback((key: keyof T, message: string) => {
    setErrs((prev) => ({ ...prev, [key]: message }))
  }, [])

  const setErrors = useCallback((errs: FormErrors<T>) => {
    setErrs(errs)
  }, [])

  const clearError = useCallback((key: keyof T) => {
    setErrs((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setData(initialRef.current)
    setErrs({})
    setDirty(false)
  }, [])

  const hasError = useCallback((key: keyof T) => !!errors[key], [errors])

  return { data, errors, dirty, set, setMany, setError, setErrors, clearError, reset, hasError }
}
