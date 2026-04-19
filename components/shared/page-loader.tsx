"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useVolcanoData } from "@/providers/volcano-data-provider";

export function PageLoader() {
  const { loading } = useVolcanoData();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
          style={{ background: "var(--bg)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.span
            className="text-7xl select-none"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🌋
          </motion.span>

          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--primary)" }}
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.2, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
              />
            ))}
          </div>

          <p className="text-sm font-medium text-[var(--muted)]">Loading volcano data…</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
