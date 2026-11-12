"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function usePageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return { isTransitioning, pathname };
}
