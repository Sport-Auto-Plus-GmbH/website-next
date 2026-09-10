import type { Metadata } from 'next'
import { Bebas_Neue, Roboto } from 'next/font/google'
import type { CSSProperties } from 'react'

import { fetchCorporateIdentity } from '@/lib/cms/corporate-identity/fetch-corporate-identity'
import './globals.css'

const bebasNeue = Bebas_Neue({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: '400',
})

const roboto = Roboto({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Sport Auto Plus',
  description: 'Sport Auto Plus website',
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const { colors } = await fetchCorporateIdentity()

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${roboto.variable} h-full antialiased`}
      style={
        {
          '--primary': colors.primary,
          '--secondary': colors.secondary,
          '--destructive': colors.destructive,
        } as CSSProperties
      }
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
