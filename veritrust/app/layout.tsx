import './globals.css'
import React from 'react'

export const metadata = {
  title: 'VeriTrust+',
  description: 'Decentralized AI trust system — KYC, credit scoring, blockchain proofs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <h1 className="text-xl font-semibold">VeriTrust+</h1>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
