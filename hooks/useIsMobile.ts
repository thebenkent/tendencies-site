"use client";

import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");

    const handle = (e: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    handle(mq);

    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  return isMobile;
}
