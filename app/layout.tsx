import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { Toaster } from 'react-hot-toast';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: 'NGV Group - Farewell & Memories',
    template: '%s | NGV Group'
  },
  description: 'Ghi lại những khoảnh khắc và lời chúc ý nghĩa của đại gia đình NGV Group.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'NGV Group - Farewell & Memories',
    description: 'Ghi lại những khoảnh khắc và lời chúc ý nghĩa của đại gia đình NGV Group.',
    url: '/',
    siteName: 'NGV Group Farewell',
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} antialiased bg-background text-foreground`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid #27272a',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
