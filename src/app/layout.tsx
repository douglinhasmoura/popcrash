import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PopCrash — Games, Cultura Pop & Entretenimento',
  description: 'As melhores notícias de games, cultura pop e entretenimento.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}