import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snuggle Cat Sitter | Loving Cat Sitting in Perth',
  description:
    'Snuggle Cat Sitter offers gentle cat sitting visits in Southern River and surrounding Perth suburbs.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
