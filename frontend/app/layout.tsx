import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'IP-SAKTI Sahayak — Multilingual RAG AI Assistant for Ayurveda IP',
  description: 'AI Innovation GPS for Ayurveda IP, Traditional Knowledge, Biological Resources, and Regulatory Guidance (SIH 2026).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
