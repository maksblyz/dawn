import './globals.css'

export const metadata = {
  title: 'Café Dawn',
  description: 'Café Dawn — a little café on wheels.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
