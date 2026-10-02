import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import "./visual-style.css";
{{THEME_IMPORT}}

export const metadata: Metadata = {
  title: "{{PROJECT_NAME}}",
  description: "A focused starting point for your next project."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body data-visual-style="{{VISUAL_STYLE}}">{{THEME_OPEN}}{children}{{THEME_CLOSE}}</body>
    </html>
  );
}