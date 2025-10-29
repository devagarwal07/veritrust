import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import { APP_NAME, APP_DESCRIPTION } from '@/utils/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="glass-effect border-t border-slate-200 dark:border-slate-800 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    © 2025 {APP_NAME}. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <a
                      href="/privacy"
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/terms"
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      Terms of Service
                    </a>
                    <a
                      href="/contact"
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

