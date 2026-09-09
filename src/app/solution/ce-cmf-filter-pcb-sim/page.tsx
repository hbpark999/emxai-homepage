import type { Metadata } from "next";
import CmcDemo from "@/components/web-tools/cmc-demo";

export const metadata: Metadata = {
  title: "CE-CMF-Filter-PCB Sim",
  description: "CMC 특성 예측과 대표 SPICE 모델을 이용한 CE EMI 교육용 데모",
  alternates: { canonical: "/solution/ce-cmf-filter-pcb-sim" },
};
export default function Page() { return <CmcDemo />; }
