import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Ashinde — Elektronika va Maishiy Texnika",
  description: "Ashinde.uz — smartfonlar, noutbuklar, televizorlar. 0-0-12 muddatli to'lov bilan. Uzum Bank, Click, Payme orqali.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={`${inter.className} bg-white text-gray-900 min-h-[100dvh] overflow-x-hidden min-w-[320px]`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
