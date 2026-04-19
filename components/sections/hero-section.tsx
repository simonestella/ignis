"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLocale } from "@/providers/locale-provider";
import { useVolcanoData } from "@/providers/volcano-data-provider";
import { getUniqueCountries, getUniqueRegions } from "@/data/volcanoes";

export function HeroSection() {
  const { t, locale, setLocale } = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const { volcanoes, loading } = useVolcanoData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const stats = volcanoes.length > 0 ? {
    volcanoes: volcanoes.length,
    countries: getUniqueCountries(volcanoes).length,
    regions: getUniqueRegions(volcanoes).length,
  } : null;

  return (
    <header className="pt-3 sm:pt-5 pb-8">
      {/* Top bar */}
      <div className="flex items-center gap-2 py-2 mb-10 sm:mb-12">
        <a
          href="https://simonestella.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white flex-shrink-0 transition-all duration-200 hover:opacity-90 hover:shadow-md hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-end))" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.2"/>
            <path d="M3.5 6h5M6 3.5C5 4.5 4.5 5.2 4.5 6S5 7.5 6 8.5M6 3.5C7 4.5 7.5 5.2 7.5 6S7 7.5 6 8.5" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          <span className="hidden sm:inline">{t("nav.portfolio")}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 8l6-6M4 2h4v4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        <div className="flex items-center rounded-full border border-[var(--card-border-solid)] overflow-hidden flex-shrink-0">
          {(["en", "it"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLocale(lang)}
              className={`px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                locale === lang ? "text-white" : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
              style={locale === lang ? { background: "linear-gradient(135deg, var(--primary), var(--primary-end))" } : {}}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="w-8 h-8 flex-shrink-0 rounded-full border border-[var(--card-border-solid)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--primary)] transition-all duration-200"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.06 1.06M11.04 11.04l1.06 1.06M2.9 12.1l1.06-1.06M11.04 3.96l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M12.5 9A6 6 0 015 1.5a6 6 0 000 11A6 6 0 0012.5 9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Hero */}
      <motion.div
        className="flex flex-col items-center text-center gap-5"
        initial={{ opacity: 0, y: 24 }}
        animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass-card px-6 sm:px-10 py-5 sm:py-7 inline-flex flex-col items-center gap-2">
          <span className="text-5xl sm:text-6xl" aria-hidden>🌋</span>
          <div>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-end))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              Ignis
            </h1>
            <p className="text-xs font-semibold tracking-[0.25em] text-[var(--muted)] uppercase mt-0.5">
              Interactive Volcano Map
            </p>
          </div>
        </div>

        <p className="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed max-w-xl px-2">
          {t("hero.subtitle")}
        </p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {[
            { key: "hero.stat_volcanoes", value: stats?.volcanoes },
            { key: "hero.stat_countries", value: stats?.countries },
            { key: "hero.stat_regions",   value: stats?.regions },
          ].map(({ key, value }) => (
            <div key={key} className="glass-card p-3 flex flex-col items-center gap-1">
              <span
                className="text-xl sm:text-2xl font-black tabular-nums"
                style={{ color: "var(--primary)" }}
              >
                {loading ? (
                  <span className="inline-block w-8 h-6 rounded animate-pulse" style={{ background: "var(--card-border)" }} />
                ) : (value ?? "—")}
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--muted)] font-medium">{t(key)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
