import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HealthMate",
  description: "Track your calories with natural language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex justify-center font-[family-name:var(--font-inter)]">
        <div className="w-full max-w-[428px] min-h-dvh bg-bg-primary relative shadow-[0_0_60px_rgba(0,0,0,0.08)]">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
