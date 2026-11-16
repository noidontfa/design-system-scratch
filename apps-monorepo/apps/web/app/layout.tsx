import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark font-sans antialiased">
      <body>{children}</body>
    </html>
  )
}
