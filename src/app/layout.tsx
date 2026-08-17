import type { Metadata } from "next";
import { Suspense } from "react";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMxAI - EM powered by AI",
  description: "전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한 솔루션 개발, 자문 및 교육",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-white text-slate-950">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
          <Suspense fallback={null}>
            <VisitorTracker />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
