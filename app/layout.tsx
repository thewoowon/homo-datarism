import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homo Datarism",
  description: "데이터 중심의 인류",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
