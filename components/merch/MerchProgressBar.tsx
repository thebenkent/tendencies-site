'use client'

type Props = {
  current: number
  minimum: number
  primaryColor?: string
  secondaryColor?: string
}

export default function MerchProgressBar({
  current,
  minimum,
  primaryColor = '#0B1F4D',
  secondaryColor = '#D71920',
}: Props) {
  const pct = Math.min(100, Math.round((current / minimum) * 100))
  const met = current >= minimum

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '10px',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: primaryColor }}>
          {current} of {minimum} orders received
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: met ? '#16a34a' : secondaryColor,
            letterSpacing: '0.04em',
          }}
        >
          {met ? 'Minimum reached ✓' : `${minimum - current} more needed`}
        </span>
      </div>

      <div
        style={{
          height: '10px',
          background: '#E2E8EF',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={minimum}
        aria-label={`${current} of ${minimum} orders`}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: met
              ? '#16a34a'
              : `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            borderRadius: '999px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  )
}
