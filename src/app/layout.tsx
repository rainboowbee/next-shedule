import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { Nunito } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

const nunito = Nunito({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: "Schedule App",
  description: "Application for scheduling lessons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark:bg-gray-900">
      <body className={`${inter.variable} ${robotoMono.variable} ${nunito.className} dark:bg-gray-900 dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
