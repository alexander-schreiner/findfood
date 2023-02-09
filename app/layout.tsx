import '../styles/globals.css'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main className="flex flex-col justify-between items-center bg-gradient-to-b from-[#08031e] to-[#010320] min-h-screen py-6 px-4">
          <div className='max-w-xl'>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
