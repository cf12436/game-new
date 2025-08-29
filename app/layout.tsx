import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://game-hub.site'),
  title: 'Game Hub - Best Free Online Games',
  description: 'Play thousands of free online games including action, puzzle, racing, sports and more. No downloads required!',
  keywords: 'free games, online games, browser games, action games, puzzle games, racing games',
  authors: [{ name: 'Game Hub' }],
  creator: 'Game Hub',
  publisher: 'Game Hub',
  icons: {
    icon: [
      { url: '/favicon-16x16.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon-32x32.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    shortcut: '/favicon-32x32.ico',
    apple: '/logo.ico',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://game-hub.site',
    title: 'Game Hub - Best Free Online Games',
    description: 'Play thousands of free online games including action, puzzle, racing, sports and more. No downloads required!',
    siteName: 'Game Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Hub - Best Free Online Games',
    description: 'Play thousands of free online games including action, puzzle, racing, sports and more. No downloads required!',
  },
  alternates: {
    canonical: 'https://game-hub.site',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-16x16.ico" sizes="16x16" type="image/x-icon" />
        <link rel="icon" href="/favicon-32x32.ico" sizes="32x32" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon-32x32.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.ico" />
        <link rel="canonical" href="https://game-hub.site" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f23" />
      </head>
      <body className="min-h-screen bg-gradient-dark text-white">
        {children}
      </body>
    </html>
  );
}
