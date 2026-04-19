export interface Volcano {
  vnum: string;
  vName: string;
  country: string;
  subregion: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  obsAbbr: string;
  webpage: string;
}

const API_URL = "https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP";
const CACHE_KEY = "ignis_volcanoes_v1";
const CACHE_DATE_KEY = "ignis_volcanoes_date_v1";

export async function getVolcanoes(): Promise<Volcano[]> {
  if (globalThis.window !== undefined) {
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    const today = new Date().toDateString();
    if (cachedDate === today) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached) as Volcano[];
    }
  }

  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`USGS API error: ${res.status}`);
  const data = await res.json() as Volcano[];

  if (globalThis.window !== undefined) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_DATE_KEY, new Date().toDateString());
    } catch { /* quota exceeded */ }
  }

  return data;
}

export function getContinent(subregion: string): string {
  const s = (subregion ?? "").toLowerCase();
  if (!s) return "Other";
  if (s.includes("antarct")) return "Antarctica";
  if (s.includes("africa")) return "Africa";
  if (s.includes("south america")) return "South America";
  if (
    s.includes("alaska") || s.includes("aleutian") || s.includes("hawaii") ||
    s.includes("cascade") || s.includes("mexico") || s.includes("central america") ||
    s.includes("west indie") || s.includes("caribbean") || s.includes("canada") ||
    s.includes("coterminous") || s.includes("yellowstone")
  ) return "North America";
  if (
    s.includes("europe") || s.includes("iceland") || s.includes("arctic") ||
    s.includes("mediterranean") || s.includes("azores")
  ) return "Europe";
  if (s.includes("atlantic")) return "Atlantic Ocean";
  if (s.includes("indian ocean")) return "Indian Ocean";
  if (
    s.includes("polynesia") || s.includes("new zealand") || s.includes("fiji") ||
    s.includes("tonga") || s.includes("kermadec") || s.includes("melanesia") ||
    s.includes("micronesia") || s.includes("australia") || s.includes("vanuatu") ||
    s.includes("samoa") || s.includes("solomon") || s.includes("papua") ||
    s.includes("cook island")
  ) return "Oceania";
  // Japan, SE Asia, Borneo, Philippines, Kamchatka, Caucasus, Middle East, etc.
  return "Asia";
}

export function getUniqueCountries(volcanoes: Volcano[]): string[] {
  return [...new Set(volcanoes.map((v) => v.country).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function getUniqueRegions(volcanoes: Volcano[]): string[] {
  return [...new Set(volcanoes.map((v) => v.subregion).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
