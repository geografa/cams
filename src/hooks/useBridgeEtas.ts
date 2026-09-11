import { useEffect, useState } from "react";
import { fetchBridgeEtas, type BridgeEtas } from "../lib/eta";

const REFRESH_MS = 5 * 60 * 1000;

/** Live Matrix ETAs for Jantzen Beach ↔ Rose Quarter; null until loaded / on failure. */
export function useBridgeEtas(): BridgeEtas | null {
  const [etas, setEtas] = useState<BridgeEtas | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const next = await fetchBridgeEtas();
      if (!cancelled && next) setEtas(next);
    }

    void load();
    const id = window.setInterval(() => void load(), REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return etas;
}
