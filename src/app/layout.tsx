import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const siteUrl = "https://www.emxai.net";
const defaultTitle = "EMxAI - 전자파 AI 설계·분석 솔루션";
const defaultDescription =
  "EMxAI는 EMI/SI/RF 전자파 설계·분석 업무의 AI 전환(AX)을 지원하는 전문 기술기업입니다. 생성형 AI 기반 EMI/SI 설계·분석 솔루션 개발, Simulation 자동화, 기업 맞춤형 교육과 자문을 제공합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | EMxAI",
  },
  description: defaultDescription,
  keywords: [
    "EMxAI",
    "전자파 AI",
    "EMI",
    "SI",
    "EMI/SI",
    "EMC",
    "RF 설계",
    "전자파 설계",
    "전자파 분석",
    "생성형 AI",
    "AI 시뮬레이션",
    "PCB 설계",
    "전자파 교육",
    "AX 전환",
  ],
  authors: [{ name: "EMxAI Inc." }],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "EMxAI",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/이엠엑스아이_AI도입효과1_v5.png",
        width: 1809,
        height: 748,
        alt: "EMxAI - AI 기반 EMI/SI Engineering 업무 전환 전후 요약",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/이엠엑스아이_AI도입효과1_v5.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "qErZ9sVky2JCIwz00RQ49zo7oeg32X_A3FxkjoUU9O4",
    other: {
      "naver-site-verification": ["1523164dd757b09c8b635446806fb2c85aa49a61"],
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EMxAI",
  legalName: "이엠엑스아이(주)",
  url: siteUrl,
  logo: `${siteUrl}/EMxAI%20Logo20251219.jpeg`,
  description: defaultDescription,
  email: "contact@emxai.net",
  telephone: "+82-31-216-2806",
  address: {
    "@type": "PostalAddress",
    streetAddress: "신원로 250번길 13, 현대테라타워 영통 B동 1022호",
    addressLocality: "수원시 영통구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  knowsAbout: [
    "EMI/SI 설계",
    "전자파 시뮬레이션",
    "생성형 AI",
    "RF 설계",
    "PCB Signal Integrity",
    "EMC 규격 검사",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-white text-slate-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
          <Suspense fallback={null}>
            <VisitorTracker />
          </Suspense>
        </div>
        <Analytics />
        {/* GA4 measurement ID: emxai-20251122 속성 (analytics.google.com) */}
        <GoogleAnalytics gaId="G-FRG6MFM4WP" />
      </body>
    </html>
  );
}
