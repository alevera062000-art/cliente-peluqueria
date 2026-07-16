"use client";

import { useEffect, useState } from "react";
import { subscribeBooked } from "@/lib/booking";

export function useBookedRealtime() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsub = subscribeBooked(() => setVersion((v) => v + 1));
    return () => unsub?.();
  }, []);

  return version;
}
