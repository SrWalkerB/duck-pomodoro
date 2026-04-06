import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Duck Pomodoro — Foco profundo, sem distrações",
  description:
    "Um timer Pomodoro desktop nativo com gestão de tarefas, estatísticas detalhadas e sons ambientes. Leve, privado e feito para quem leva produtividade a sério.",
  keywords: ["pomodoro", "timer", "produtividade", "foco", "tauri", "desktop"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${bricolage.variable} antialiased`}
    >
      <body className="min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
