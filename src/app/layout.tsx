import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Link from 'next/link';
import { Activity, ShieldCheck } from 'lucide-react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Team Pulse Hub — Painel Analítico de Futebol',
  description:
    'Acompanhamento analítico e estatístico em tempo real do Brasileirão Série A com blindagem de taxa e cache ISR de alta performance.',
  keywords: ['Futebol', 'Flamengo', 'Brasileirão', 'Estatísticas', 'Team Pulse Hub', 'API-Football'],
  authors: [{ name: 'Team Pulse Hub Team' }],
  openGraph: {
    title: 'Team Pulse Hub — Painel Analítico de Futebol',
    description: 'Acompanhamento analítico em tempo real do Brasileirão Série A com cache ISR.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="font-sans bg-[#090d16] text-slate-100 antialiased selection:bg-red-500/30 selection:text-red-200 min-h-screen flex flex-col">
        {/* Header Superior Global */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo da Aplicação */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 shadow-lg shadow-red-950/40 group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white font-mono leading-none">
                  TEAM<span className="text-red-500 font-sans">PULSE</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-tight">
                  Hub • Brasileirão 2026
                </span>
              </div>
            </Link>

            {/* Badges de Status do Sistema */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>ISR Cache Ativo (Anti-Rate-Limit)</span>
              </div>
              <Link
                href="/api/health"
                target="_blank"
                className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                title="Status da API e Integridade"
              >
                API Health
              </Link>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>

        {/* Rodapé */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © 2026 Team Pulse Hub. Estatísticas alimentadas via API-Football v3.
            </p>
            <p className="text-[11px] text-slate-400">
              Otimizado para Vercel Serverless & Edge Cache ISR.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
