import type { Metadata } from 'next'
import { Geist, Geist_Mono, Hanken_Grotesk } from 'next/font/google'
import HeinekenPortal, { type Layout } from './HeinekenPortal'

const display = Hanken_Grotesk({ subsets: ['latin'], variable: '--hk-display' })
const body = Geist({ subsets: ['latin'], variable: '--hk-body' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--hk-mono' })

export const metadata: Metadata = {
  title: 'Heineken Brands Uniform Store · Tendencies',
  robots: { index: false, follow: false },
}

export default async function HeinekenUniformPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string }>
}) {
  const { layout } = await searchParams
  const resolved: Layout = layout?.toLowerCase() === 'storefront' ? 'Storefront' : 'Sidebar'

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <HeinekenPortal layout={resolved} allowance={800} />
    </div>
  )
}
