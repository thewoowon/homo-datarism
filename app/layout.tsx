import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "HOMO DATARISM",
  description: "데이터 중심의 인류",
  metadataBase: new URL("https://homodatarism.com"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://homodatarism.com",
    siteName: "데이터 중심의 인류",
    images: [
      {
        url: "https://homodatarism.com/og-image.png",
        width: 600,
        height: 314,
        alt: "데이터 중심의 인류",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@homodatarism",
    siteId: "1467726470533754880",
    creatorId: "1467726470533754880",
    creator: "@homodatarism",
    title: "HOMO DATARISM",
    description: "데이터 중심의 인류",
    images: {
      url: "https://homodatarism.com/og-image.png",
      alt: "데이터 중심의 인류",
    },
  },
  generator: "thewoowon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
        <meta
          name="naver-site-verification"
          content={process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
