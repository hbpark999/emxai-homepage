const mapSrc =
  "https://www.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%88%98%EC%9B%90%EC%8B%9C%20%EC%98%81%ED%86%B5%EA%B5%AC%20%EC%8B%A0%EC%9B%90%EB%A1%9C%20250%EB%B2%88%EA%B8%B8%2013%20%ED%98%84%EB%8C%80%ED%85%8C%EB%9D%BC%ED%83%80%EC%9B%8C%20%EC%98%81%ED%86%B5%20B%EB%8F%99%201022%ED%98%B8&output=embed";

export function SiteFooter() {
  return (
    <footer className="bg-[#2563eb] text-white">
      <div className="mx-auto w-full max-w-[92vw] px-6 py-8 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div className="space-y-6">
            <div>
              <p className="text-base font-black">
                이엠엑스아이(주) <span className="text-sm font-semibold">EMxAI Inc.</span>
              </p>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/90">
                경기도 수원시 영통구 신원로 250번길 13, 현대테라타워 영통 B동 1022호
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-white">
              <a href="mailto:contact@emxai.net" className="transition hover:text-lime-200">
                contact@emxai.net
              </a>
              <a href="tel:031-216-2806" className="transition hover:text-lime-200">
                031-216-2806
              </a>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-white/20 pt-4 text-xs font-bold text-white/90">
              <p>Copyright © EMxAI Inc. All rights reserved.</p>
              <p>AI-powered EMI/SI Design · Analysis · Education</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/25 bg-white/10 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/90">
                Location
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%88%98%EC%9B%90%EC%8B%9C%20%EC%98%81%ED%86%B5%EA%B5%AC%20%EC%8B%A0%EC%9B%90%EB%A1%9C%20250%EB%B2%88%EA%B8%B8%2013%20%ED%98%84%EB%8C%80%ED%85%8C%EB%9D%BC%ED%83%80%EC%9B%8C%20%EC%98%81%ED%86%B5%20B%EB%8F%99%201022%ED%98%B8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-lime-200 transition hover:text-white"
              >
                지도 열기
              </a>
            </div>
            <iframe
              title="EMxAI location map"
              src={mapSrc}
              className="h-40 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
