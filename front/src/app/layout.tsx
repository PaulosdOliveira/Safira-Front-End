import type { Metadata } from "next";
import { Geist, Geist_Mono, Belleza } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safira",
  description: "Descricao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
    <head>
       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols"/>
       <link rel="shortcut icon" href="/favi_safira.png" type="png" />
    </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
