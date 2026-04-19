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
  if (typeof window !== "undefined") {
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    const today = new Date().toDateString();

    if (cachedDate === today) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached) as Volcano[];
      }
    }
  }

  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`USGS API error: ${res.status}`);
  const data = await res.json() as Volcano[];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_DATE_KEY, new Date().toDateString());
    } catch {
      // localStorage quota exceeded — ignore
    }
  }

  return data;
}

export function getUniqueCountries(volcanoes: Volcano[]): string[] {
  return [...new Set(volcanoes.map((v) => v.country))].sort();
}

export function getUniqueRegions(volcanoes: Volcano[]): string[] {
  return [...new Set(volcanoes.map((v) => v.subregion))].sort();
}
