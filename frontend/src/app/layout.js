import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LangSync from '@/components/layout/LangSync';

export const metadata = {
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
          <LangSync />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
