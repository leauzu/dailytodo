import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Growth",
  description: "Mobile-first daily growth app with server-side Vercel logic."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
