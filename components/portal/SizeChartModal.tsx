'use client'

import { useState, useEffect } from 'react'
import type { PortalSizeChart } from '@/lib/portal/types'

const BORDER = 'rgba(255,255,255,0.08)'
const LIME = '#b8f400'

export default function SizeChartModal({
  isOpen,
  onClose,
  sizeChart,
  measureGuide,
}: {
  isOpen: boolean
  onClose: () => void
  sizeChart?: PortalSizeChart
  measureGuide?: string
}) {
  const hasChart = !!(sizeChart && sizeChart.headers.length > 0)
  const [tab, setTab] = useState<'chart' | 'measure'>(hasChart ? 'chart' : 'measure')

  useEffect(() => {
    if (isOpen) setTab(hasChart ? 'chart' : 'measure')
  }, [isOpen, hasChart])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0c0c0c',
          border: `1px solid ${BORDER}`,
          width: '100%',
          maxWidth: '740px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Helvetica, Arial, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#f5f5f0',
            }}
          >
            Size Guide
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.45)',
              fontSize: '22px',
              lineHeight: 1,
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
            padding: '0 24px',
          }}
        >
          {(['chart', 'measure'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 0',
                marginRight: '28px',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tab === t ? LIME : 'transparent'}`,
                color: tab === t ? '#f5f5f0' : 'rgba(255,255,255,0.35)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'Helvetica, Arial, sans-serif',
                transition: 'color 0.15s',
                marginBottom: '-1px',
              }}
            >
              {t === 'chart' ? 'Size Chart' : 'How to Measure'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: '28px 24px', flex: 1 }}>
          {tab === 'chart' && (
            hasChart ? (
              <>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '12px',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            padding: '10px 14px 10px 0',
                            textAlign: 'left',
                            fontSize: '8px',
                            fontWeight: 700,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.35)',
                            borderBottom: `1px solid ${BORDER}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Size
                        </th>
                        {sizeChart!.headers.map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: '10px 8px',
                              textAlign: 'center',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: '#f5f5f0',
                              borderBottom: `1px solid ${BORDER}`,
                              whiteSpace: 'nowrap',
                              minWidth: '44px',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart!.rows.map((row, i) => (
                        <tr
                          key={i}
                          style={{
                            background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                          }}
                        >
                          <td
                            style={{
                              padding: '10px 14px 10px 0',
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.65)',
                              borderBottom: `1px solid rgba(255,255,255,0.04)`,
                              whiteSpace: 'nowrap',
                              fontWeight: 600,
                            }}
                          >
                            {row.label}
                          </td>
                          {row.values.map((v, j) => (
                            <td
                              key={j}
                              style={{
                                padding: '10px 8px',
                                textAlign: 'center',
                                fontSize: '12px',
                                color: '#f5f5f0',
                                borderBottom: `1px solid rgba(255,255,255,0.04)`,
                              }}
                            >
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>
                  All measurements in centimetres.{' '}
                  <button
                    onClick={() => setTab('measure')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: LIME,
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontSize: '11px',
                      padding: 0,
                    }}
                  >
                    How to measure →
                  </button>
                </p>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Size chart not available for this item.
                </p>
                {measureGuide && (
                  <button
                    onClick={() => setTab('measure')}
                    style={{
                      background: 'none',
                      border: `1px solid rgba(255,255,255,0.18)`,
                      color: '#f5f5f0',
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      padding: '10px 22px',
                      cursor: 'pointer',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                    }}
                  >
                    View measurement guide →
                  </button>
                )}
              </div>
            )
          )}

          {tab === 'measure' && (
            measureGuide ? (
              <>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.75,
                    marginBottom: '28px',
                    maxWidth: '480px',
                  }}
                >
                  Use a fabric tape measure and follow the guide below. Measure over lightweight
                  clothing. When between sizes, select the larger size.
                </p>
                <img
                  src={measureGuide}
                  alt="How to measure"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '520px',
                    height: 'auto',
                    margin: '0 auto',
                  }}
                />
              </>
            ) : (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '40px 0' }}>
                Measurement guide not available.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}
