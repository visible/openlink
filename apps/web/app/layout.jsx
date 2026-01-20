import './globals.css'

export const metadata = {
  title: 'openlink',
  description: 'Edge-first link preview. Zero dependencies.',
  openGraph: {
    title: 'openlink',
    description: 'Edge-first link preview. Zero dependencies.',
    url: 'https://openlink.sh',
    siteName: 'openlink',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'openlink',
    description: 'Edge-first link preview. Zero dependencies.'
  }
}

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
