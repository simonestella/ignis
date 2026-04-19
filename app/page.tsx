import { HeroSection } from "@/components/sections/hero-section";
import { MapSection } from "@/components/sections/map-section";
import { BackToTop } from "@/components/shared/back-to-top";
import { PageLoader } from "@/components/shared/page-loader";

export default function Home() {
  return (
    <main className="container-shell">
      <PageLoader />
      <HeroSection />
      <MapSection />

      <BackToTop />

      <footer className="mt-16 pb-10 pt-8 border-t border-[var(--card-border-solid)] text-center">
        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Ignis — Volcano data from{" "}
          <a
            href="https://volcanoes.usgs.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--primary)] transition-colors underline underline-offset-2"
          >
            USGS
          </a>
          {" "}·{" "}
          <a
            href="https://simonestella.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--primary)] transition-colors underline underline-offset-2"
          >
            Simone Stella
          </a>
        </p>
      </footer>
    </main>
  );
}
