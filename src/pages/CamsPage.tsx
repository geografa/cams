import { useEffect } from "react";
import { LazyCameraMap } from "../components/map/LazyCameraMap";

export function CamsPage() {
  useEffect(() => {
    document.title = "Live Oregon traffic cameras — PDX Traffic";
  }, []);

  return (
    <div className="h-[calc(100dvh-4.5rem)] w-full">
      <h1 className="sr-only">Live Oregon traffic cameras</h1>
      <LazyCameraMap />
    </div>
  );
}
