import { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Ethiopic } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AutoTriggerBootstrap from '@/components/system/AutoTriggerBootstrap';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-noto-ethio',
  weight: ['400', '700', '900'],
});

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Trustworthy Machinery (TM) | ታማኝ ማሽነሪ',
  description: "Ethiopia's #1 trusted heavy machinery marketplace — buy, rent, transport, repair and operate.",
  manifest: '/manifest.json',
  keywords: ['machinery', 'heavy equipment', 'Ethiopia', 'excavator', 'crane', 'loader', 'rental'],
  openGraph: {
    title: 'Trustworthy Machinery (TM) | ታማኝ ማሽነሪ',
    description: "Ethiopia's #1 trusted heavy machinery marketplace.",
    locale: 'en_ET',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoEthiopic.variable}`}>
      <body className="antialiased overflow-x-hidden" style={{ backgroundColor: '#050d1a', color: '#ffffff' }}>
        <LanguageProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <Footer />
              <AutoTriggerBootstrap />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
