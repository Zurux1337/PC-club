import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Golos_Text, Oswald } from 'next/font/google'
import './globals.css'

const displayFont = Oswald({
  variable: '--font-display',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

const bodyFont = Golos_Text({
  variable: '--font-body',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

const title = 'CTRL CLUB — демо компьютерного клуба'
const description =
  'CTRL CLUB — демонстрационный сайт компьютерного клуба: игровые зоны Arena, Bootcamp и Duo, примеры тарифов и демо-бронирование. Без отправки заявок и оплаты.'

export const metadata: Metadata = {
  title: {
    default: title,
    template: '%s | CTRL CLUB',
  },
  description,
  applicationName: 'CTRL CLUB',
  keywords: ['CTRL CLUB', 'компьютерный клуб', 'игровые зоны', 'киберспорт', 'демо-бронирование'],
  openGraph: {
    title,
    description,
    siteName: 'CTRL CLUB',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className={`${bodyFont.className} bg-[#111111] text-[#f5f5f5] antialiased`}>
        {children}
      </body>
    </html>
  )
}
