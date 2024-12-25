import './globals.css'
import { Inter, Fira_Code } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })
const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-fira-code',
})

export const metadata: Metadata = {
  title: 'Matrix Terminal Portfolio',
  description: 'An interactive terminal portfolio with Matrix theme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${firaCode.variable}`}>
      <body className={`${inter.className} bg-black text-emerald-400 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

