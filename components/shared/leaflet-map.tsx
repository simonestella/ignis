"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useLocale } from "@/providers/locale-provider";
import { useVolcanoData } from "@/providers/volcano-data-provider";
import { getContinent, type Volcano } from "@/data/volcanoes";
import "leaflet/dist/leaflet.css";

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

type ActivityFilter = "all" | "monitored" | "unmonitored";

function TileLayerSwitcher({ isDark }: Readonly<{ isDark: boolean }>) {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [isDark, map]);
  return (
    <TileLayer
      key={isDark ? "dark" : "light"}
      url={isDark ? TILE_DARK : TILE_LIGHT}
      attribution={TILE_ATTR}
      maxZoom={18}
    />
  );
}

function MobileFixLayer() {
  const map = useMap();
  useEffect(() => {
    // Disable Leaflet's custom tap handler so iOS single-tap opens popups
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = (map as any).tap;
    if (t) t.disable();
  }, [map]);
  return null;
}

function markerStyle(v: Volcano): { fill: string; stroke: string; radius: number } {
  // Radius 8–18 based on elevation — min 8 for mobile touch targets
  const radius = Math.max(8, Math.min(18, 8 + Math.round(Math.max(0, v.elevation_m ?? 0) / 500)));

  const abbr = (v.obsAbbr ?? "").toUpperCase().trim();
  if (!abbr) return { fill: "#A07858", stroke: "#7A5A3A", radius };

  switch (abbr) {
    case "AVO": return { fill: "#FF2800", stroke: "#CC1200", radius }; // Alaska — deep red
    case "HVO": return { fill: "#FF6200", stroke: "#CC4000", radius }; // Hawaii — orange-red
    case "CVO": return { fill: "#FF8C00", stroke: "#CC6000", radius }; // Cascades — orange
    case "YVO": return { fill: "#FFA800", stroke: "#CC7800", radius }; // Yellowstone — amber
    case "MVO": return { fill: "#FF4400", stroke: "#CC2200", radius }; // Montserrat — red
    default:    return { fill: "#E8650A", stroke: "#B84400", radius }; // other monitored
  }
}

export default function LeafletMap() {
  const { resolvedTheme } = useTheme();
  const { t } = useLocale();
  const { volcanoes, error, reload } = useVolcanoData();
  const isDark = resolvedTheme === "dark";

  const [activity, setActivity] = useState<ActivityFilter>("all");
  const [continent, setContinent] = useState("all");
  const [country, setCountry] = useState("all");

  // Derive continent list from all volcanoes
  const continents = useMemo(
    () => [...new Set(volcanoes.map((v) => getContinent(v.subregion)))].sort((a, b) => a.localeCompare(b)),
    [volcanoes]
  );

  // Derive country list filtered by selected continent
  const countries = useMemo(() => {
    const pool = continent === "all" ? volcanoes : volcanoes.filter((v) => getContinent(v.subregion) === continent);
    return [...new Set(pool.map((v) => v.country).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [volcanoes, continent]);

  // Reset country when continent changes
  useEffect(() => { setCountry("all"); }, [continent]);

  const displayed = useMemo(() => {
    return volcanoes.filter((v) => {
      if (activity === "monitored"   && !v.obsAbbr?.trim()) return false;
      if (activity === "unmonitored" &&  v.obsAbbr?.trim()) return false;
      if (continent !== "all" && getContinent(v.subregion) !== continent) return false;
      if (country   !== "all" && v.country !== country) return false;
      return true;
    });
  }, [volcanoes, activity, continent, country]);

  const monitoredCount   = useMemo(() => volcanoes.filter((v) =>  v.obsAbbr?.trim()).length, [volcanoes]);
  const unmonitoredCount = useMemo(() => volcanoes.filter((v) => !v.obsAbbr?.trim()).length, [volcanoes]);

  const selectCls = `
    h-9 rounded-xl border border-[var(--card-border-solid)] bg-[var(--card-bg)]
    text-xs font-semibold text-[var(--ink)] px-3 pr-8
    focus:outline-none focus:border-[var(--primary)]
    transition-colors duration-150 appearance-none
    bg-[image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23B06030' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")]
    bg-no-repeat bg-[right_10px_center]
  `.replaceAll(/\s+/g, " ").trim();

  if (error) {
    return (
      <div className="w-full h-[580px] rounded-2xl border border-[var(--card-border-solid)] bg-[var(--card-bg)] flex flex-col items-center justify-center gap-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-sm text-[var(--muted)]">{t("map.error")}</p>
        <button
          onClick={reload}
          className="px-4 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-end))" }}
        >
          {t("map.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Activity filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {([
          { id: "all",          label: t("map.filter_all"),          count: volcanoes.length },
          { id: "monitored",    label: t("map.filter_monitored"),    count: monitoredCount },
          { id: "unmonitored",  label: t("map.filter_unmonitored"),  count: unmonitoredCount },
        ] as { id: ActivityFilter; label: string; count: number }[]).map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActivity(id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activity === id
                ? "text-white border-transparent"
                : "text-[var(--muted)] border-[var(--card-border-solid)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
            style={activity === id ? { background: "linear-gradient(135deg, var(--primary), var(--primary-end))" } : {}}
          >
            {label}
            {volcanoes.length > 0 && (
              <span className="ml-1.5 opacity-70 tabular-nums">{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Continent + Country selects */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
          className={selectCls}
          aria-label={t("map.continent")}
        >
          <option value="all">{t("map.all_continents")}</option>
          {continents.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={selectCls}
          aria-label={t("map.country")}
          disabled={countries.length === 0}
        >
          <option value="all">{t("map.all_countries")}</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {displayed.length !== volcanoes.length && (
          <span className="text-xs text-[var(--muted)] ml-1">
            {displayed.length} / {volcanoes.length}
          </span>
        )}
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
          <MobileFixLayer />
          <TileLayerSwitcher isDark={isDark} />

          {displayed.map((v) => {
            const { fill, stroke, radius } = markerStyle(v);
            return (
              <CircleMarker
                key={v.vnum}
                center={[v.latitude, v.longitude]}
                radius={radius}
                pathOptions={{ fillColor: fill, fillOpacity: 0.85, color: stroke, weight: 1.5 }}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
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
                          <span className="text-[var(--ink-2)] font-medium">{v.elevation_m.toLocaleString()} m</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[var(--muted)]">{t("map.activity")}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${fill}22`, color: fill }}
                        >
                          {v.obsAbbr?.trim() ? v.obsAbbr : "GVP"}
                        </span>
                      </div>
                    </div>

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
      <div className="glass-card p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Size column */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
            {t("map.legend_size")}
          </p>
          <div className="flex flex-col gap-2.5">
            {([
              { size: 8,  label: "< 500 m",    sublabel: t("map.legend_low_elev") },
              { size: 13, label: "~2 500 m",   sublabel: t("map.legend_mid_elev") },
              { size: 18, label: "≥ 5 000 m",  sublabel: t("map.legend_high_elev") },
            ]).map(({ size, label, sublabel }) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="rounded-full flex-shrink-0"
                  style={{ width: size, height: size, background: "var(--primary)", opacity: 0.75 }}
                />
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-[var(--ink-2)]">{label}</span>
                  <span className="text-[11px] text-[var(--muted)] ml-1.5">{sublabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color column */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
            {t("map.legend_color_title")}
          </p>
          <div className="flex flex-col gap-2">
            {([
              { color: "#A07858", label: t("map.legend_unmonitored"),  sub: t("map.legend_unmonitored_sub") },
              { color: "#E8650A", label: t("map.legend_monitored"),    sub: t("map.legend_monitored_sub") },
              { color: "#FF2800", label: "AVO",  sub: t("map.legend_avo") },
              { color: "#FF6200", label: "HVO",  sub: t("map.legend_hvo") },
              { color: "#FF8C00", label: "CVO",  sub: t("map.legend_cvo") },
              { color: "#FFA800", label: "YVO",  sub: t("map.legend_yvo") },
              { color: "#FF4400", label: "MVO",  sub: t("map.legend_mvo") },
            ]).map(({ color, label, sub }) => (
              <div key={label} className="flex items-start gap-2.5">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-[3px]"
                  style={{ background: color }}
                />
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-[var(--ink-2)] leading-tight">{label}</div>
                  <div className="text-[10px] text-[var(--muted)] leading-tight">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
