import { Metadata, Viewport } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import AutoTriggerBootstrap from '@/components/system/AutoTriggerBootstrap';

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Trustworthy Machinery (TM) | ታማኝ ማሽነሪ',
  description: 'Ethiopia’s #1 Industrial Marketplace.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <AutoTriggerBootstrap />
        <LanguageProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <Footer />
              <PWAInstallPrompt />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}