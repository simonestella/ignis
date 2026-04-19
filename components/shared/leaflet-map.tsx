"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useLocale } from "@/providers/locale-provider";
import { getVolcanoes, type Volcano } from "@/data/volcanoes";
import "leaflet/dist/leaflet.css";

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function TileLayerSwitcher({ isDark }: { isDark: boolean }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [isDark, map]);

  return (
    <TileLayer
      key={isDark ? "dark" : "light"}
      url={isDark ? TILE_DARK : TILE_LIGHT}
      attribution={TILE_ATTR}
      maxZoom={18}
    />
  );
}

function markerColor(obsAbbr: string): { fill: string; stroke: string } {
  switch (obsAbbr?.toUpperCase()) {
    case "AVO":  return { fill: "#FF4500", stroke: "#CC2200" };
    case "HVO":  return { fill: "#FF6B00", stroke: "#CC4400" };
    case "CVO":  return { fill: "#FF8C00", stroke: "#CC6000" };
    case "YVO":  return { fill: "#FFA500", stroke: "#CC7700" };
    default:     return { fill: "#E8650A", stroke: "#B84400" };
  }
}

export default function LeafletMap() {
  const { resolvedTheme } = useTheme();
  const { t } = useLocale();
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<"all" | "active">("all");

  const isDark = resolvedTheme === "dark";

  const load = useCallback(() => {
    setError(false);
    getVolcanoes()
      .then(setVolcanoes)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const displayed = filter === "active"
    ? volcanoes.filter((v) => v.obsAbbr && v.obsAbbr.trim() !== "")
    : volcanoes;

  if (error) {
    return (
      <div className="w-full h-[600px] rounded-2xl border border-[var(--card-border-solid)] bg-[var(--card-bg)] flex flex-col items-center justify-center gap-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-sm text-[var(--muted)]">{t("map.error")}</p>
        <button
          onClick={load}
          className="px-4 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-end))" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "active"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === f
                ? "text-white border-transparent"
                : "text-[var(--muted)] border-[var(--card-border-solid)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
            style={filter === f ? { background: "linear-gradient(135deg, var(--primary), var(--primary-end))" } : {}}
          >
            {f === "all" ? t("map.filter_all") : t("map.filter_active")}
            {volcanoes.length > 0 && (
              <span className="ml-1.5 opacity-70">
                {f === "all" ? volcanoes.length : volcanoes.filter((v) => v.obsAbbr?.trim()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Map */}
      <div
        className="w-full rounded-2xl overflow-hidden border border-[var(--card-border-solid)]"
        style={{ height: 580, boxShadow: "0 8px 32px rgba(232,101,10,0.12), 0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <MapContainer
          center={[20, 10]}
          zoom={2}
          minZoom={2}
          style={{ width: "100%", height: "100%" }}
          worldCopyJump
        >
          <TileLayerSwitcher isDark={isDark} />

          {displayed.map((v) => {
            const { fill, stroke } = markerColor(v.obsAbbr);
            return (
              <CircleMarker
                key={v.vnum}
                center={[v.latitude, v.longitude]}
                radius={6}
                pathOptions={{
                  fillColor: fill,
                  fillOpacity: 0.85,
                  color: stroke,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `linear-gradient(135deg, ${fill}28, ${stroke}18)` }}
                      >
                        🌋
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[var(--ink)] leading-tight">{v.vName}</h3>
                        <p className="text-[11px] text-[var(--muted)] mt-0.5">{v.country}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 text-[12px]">
                      {v.subregion && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[var(--muted)]">{t("map.region")}</span>
                          <span className="text-[var(--ink-2)] font-medium text-right">{v.subregion}</span>
                        </div>
                      )}
                      {v.elevation_m !== undefined && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[var(--muted)]">{t("map.elevation")}</span>
                          <span className="text-[var(--ink-2)] font-medium">
                            {v.elevation_m.toLocaleString()} m
                          </span>
                        </div>
                      )}
                      {v.obsAbbr && v.obsAbbr.trim() && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[var(--muted)]">{t("map.activity")}</span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${fill}22`, color: fill }}
                          >
                            {v.obsAbbr}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Link */}
                    {v.webpage && (
                      <a
                        href={v.webpage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-80"
                        style={{ color: fill }}
                      >
                        {t("map.more_info")}
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                          <path d="M2 8l6-6M4 2h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-[11px] text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#E8650A" }} />
          Global (GVP)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#FF4500" }} />
          Alaska (AVO)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#FF6B00" }} />
          Hawaii (HVO)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#FF8C00" }} />
          Cascades (CVO)
        </span>
      </div>
    </div>
  );
}
