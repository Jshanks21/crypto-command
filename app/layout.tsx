import '@/styles/globals.css'

export const metadata = {
  title: 'Crypto Command HQ',
  description: 'Your Crypto Command Center',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className='app'>
          {children}
        </main>
      </body>
    </html>
  )
}
