import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PublicLayout from '@/components/layout/PublicLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AI Productivity Hub | AI Tools & Productivity Tutorials',
    template: '%s | AI Productivity Hub',
  },
  description:
    'Tutorials, reviews and guides for AI tools, productivity apps and more. Master AI tools and boost your productivity.',
  openGraph: {
    type: 'website',
    siteName: 'AI Productivity Hub',
    title: 'AI Productivity Hub | AI Tools & Productivity Tutorials',
    description:
      'Tutorials, reviews and guides for AI tools, productivity apps and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Productivity Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourhandle',
    title: 'AI Productivity Hub | AI Tools & Productivity Tutorials',
    description:
      'Tutorials, reviews and guides for AI tools, productivity apps and more.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
