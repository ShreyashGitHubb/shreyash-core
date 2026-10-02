import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
{{THEME_IMPORT}}

export const metadata: Metadata = {
  title: "HackForge Starter",
  description: "A focused starting point for your next hackathon project."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{{THEME_OPEN}}{children}{{THEME_CLOSE}}</body>
    </html>
  );
}