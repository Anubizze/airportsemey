import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AirlinesProvider } from '@/context/AirlinesContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LangSync from '@/components/layout/LangSync';
import EotinishButton from '@/components/layout/EotinishButton';

export const metadata = {
  metadataBase: new URL('https://abaiairport.kz'),
  title: {
    default: 'Аэропорт Семей — Международный аэропорт',
    template: '%s | Аэропорт Семей',
  },
  description:
    'Международный аэропорт Семей (IATA: HSM) — надёжный транспортный узел Восточного Казахстана.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <LanguageProvider>
          <AirlinesProvider>
            <LangSync />
            <Header />
            <main className="flex-1">{children}</main>
            <EotinishButton />
            <Footer />
          </AirlinesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
