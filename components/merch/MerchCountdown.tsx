'use client'

import { useEffect, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calcTimeLeft(closingDate: string): TimeLeft {
  const diff = new Date(closingDate).getTime() - Date.now()

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    }
  }

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    expired: false,
  }
}

type Props = {
  closingDate: string
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  labelColor?: string
}

export default function MerchCountdown({
  closingDate,
  primaryColor = '#0B1F4D',
  secondaryColor = '#D71920',
  textColor,
  labelColor,
}: Props) {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const update = () => {
      setTime(calcTimeLeft(closingDate))
    }

    update()

    const id = setInterval(update, 1000)

    return () => clearInterval(id)
  }, [closingDate])

  // Prevent hydration mismatch
  if (!time) {
    return (
      <div
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
        }}
      />
    )
  }

  if (time.expired) {
    return (
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: secondaryColor,
        }}
      >
        Orders are closed
      </div>
    )
  }

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hrs', value: time.hours },
    { label: 'Min', value: time.minutes },
    { label: 'Sec', value: time.seconds },
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
      }}
    >
      {units.map(({ label, value }, i) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: i < 3 ? '4px' : undefined,
          }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: textColor ?? primaryColor,
                lineHeight: 1,
                minWidth: '2ch',
                textAlign: 'center',
              }}
            >
              {String(value).padStart(2, '0')}
            </div>

            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: labelColor ?? '#5A6B7E',
                marginTop: '4px',
              }}
            >
              {label}
            </div>
          </div>

          {i < 3 && (
            <span
              aria-hidden
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: secondaryColor,
                marginBottom: '18px',
                lineHeight: 1,
              }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}