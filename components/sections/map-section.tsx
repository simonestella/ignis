"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLocale } from "@/providers/locale-provider";

const LeafletMap = dynamic(() => import("@/components/shared/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl border border-[var(--card-border-solid)] bg-[var(--card-bg)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl animate-pulse">🌋</span>
        <span className="text-sm text-[var(--muted)]">Loading map…</span>
      </div>
    </div>
  ),
});

export function MapSection() {
  const { t } = useLocale();

  return (
    <section id="map" className="pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-2">
          {t("map.title")}
        </h2>
        <p className="text-sm text-[var(--ink-3)] leading-relaxed max-w-xl">
          {t("map.subtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <LeafletMap />
      </motion.div>
    </section>
  );
}
