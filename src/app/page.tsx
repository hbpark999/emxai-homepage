import { HomeHero } from "@/components/home/home-hero";
import { HomeSolutions } from "@/components/home/home-solutions";
import { HomeUpdates } from "@/components/home/home-updates";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <HomeHero />
      <HomeSolutions />
      <HomeUpdates />
    </main>
  );
}
