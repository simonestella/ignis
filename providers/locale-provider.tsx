"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Locale = "it" | "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
});

const translations: Record<string, Record<Locale, string>> = {
  "nav.portfolio": { it: "Portfolio", en: "Portfolio" },
  "nav.map": { it: "Mappa", en: "Map" },
  "hero.title": { it: "Esplora i vulcani del mondo", en: "Explore the world's volcanoes" },
  "hero.subtitle": {
    it: "Una mappa interattiva dei vulcani attivi del mondo, aggiornata quotidianamente con i dati USGS.",
    en: "An interactive map of the world's active volcanoes, updated daily with USGS data."
  },
  "hero.portfolio_link": { it: "Visita il mio Portfolio", en: "Visit my Portfolio" },
  "hero.stat_volcanoes": { it: "Vulcani", en: "Volcanoes" },
  "hero.stat_countries": { it: "Paesi", en: "Countries" },
  "hero.stat_regions": { it: "Regioni", en: "Regions" },
  "map.title": { it: "Mappa interattiva", en: "Interactive Map" },
  "map.subtitle": {
    it: "Clicca su un vulcano per scoprire i dettagli. I dati vengono aggiornati una volta al giorno.",
    en: "Click a volcano to see its details. Data is refreshed once a day."
  },
  "map.error": { it: "Impossibile caricare i dati. Riprova più tardi.", en: "Could not load data. Please try again later." },
  "map.elevation": { it: "Quota", en: "Elevation" },
  "map.country": { it: "Paese", en: "Country" },
  "map.region": { it: "Regione", en: "Region" },
  "map.activity": { it: "Monitoraggio", en: "Monitoring" },
  "map.more_info": { it: "Ulteriori informazioni", en: "More info" },
  "map.filter_all": { it: "Tutti", en: "All" },
  "map.filter_monitored": { it: "Monitorati", en: "Monitored" },
  "map.filter_unmonitored": { it: "Non monitorati", en: "Unmonitored" },
  "map.all_continents": { it: "Tutti i continenti", en: "All continents" },
  "map.all_countries": { it: "Tutti i paesi", en: "All countries" },
  "map.continent": { it: "Continente", en: "Continent" },
  "map.legend_size": { it: "Dimensione = quota", en: "Size = elevation" },
  "map.legend_monitored": { it: "Monitorato USGS", en: "USGS monitored" },
  "map.legend_unmonitored": { it: "Non monitorato", en: "Unmonitored" },
  "map.retry": { it: "Riprova", en: "Retry" },
  "theme.light": { it: "Chiaro", en: "Light" },
  "theme.dark": { it: "Scuro", en: "Dark" },
};

export function LocaleProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, setLocale] = useState<Locale>("en");

  const ctx = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string): string => translations[key]?.[locale] ?? key,
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={ctx}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
