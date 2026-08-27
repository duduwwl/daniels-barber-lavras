import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://daniels-barber-lavras.duduwwl.chatgpt.site'),
  title: "Daniel's Barber | Barbearia em Lavras, MG",
  description: 'Cortes, barba e estilo com atendimento profissional em Lavras, Minas Gerais.',
  openGraph: {
    title: "Daniel's Barber | Estilo com assinatura",
    description: 'Agende seu corte ou barba com Daniel e Vinícius em Lavras, MG.',
    locale: 'pt_BR',
    type: 'website',
    url: 'https://daniels-barber-lavras.duduwwl.chatgpt.site',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: "Daniel's Barber — Estilo com assinatura" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Daniel's Barber | Estilo com assinatura",
    description: 'Agende seu corte ou barba com Daniel e Vinícius em Lavras, MG.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
