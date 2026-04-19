"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getVolcanoes, type Volcano } from "@/data/volcanoes";

interface VolcanoDataState {
  volcanoes: Volcano[];
  loading: boolean;
  error: boolean;
  reload: () => void;
}

const VolcanoDataContext = createContext<VolcanoDataState>({
  volcanoes: [],
  loading: true,
  error: false,
  reload: () => {},
});

export function VolcanoDataProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    setError(false);
    getVolcanoes()
      .then((data) => { setVolcanoes(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return (
    <VolcanoDataContext.Provider value={{ volcanoes, loading, error, reload }}>
      {children}
    </VolcanoDataContext.Provider>
  );
}

export function useVolcanoData() {
  return useContext(VolcanoDataContext);
}
