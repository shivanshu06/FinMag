import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Quicksand } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: 'Personal Finance Manager',
  description: 'Manage your personal finances with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}