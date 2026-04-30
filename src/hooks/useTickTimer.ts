import { useEffect, useState } from 'react';

export const useTickTimer = (sippedAt?: number) => {
  const [displayTicks, setDisplayTicks] = useState(0);

  useEffect(() => {
    if (!sippedAt) {
      setDisplayTicks(0);
      return;
    }

    const OSRS_TICK_MS = 600;
    const MAX_TICKS = 500;

    const calculateRemaining = () => {
      const elapsedMs = Date.now() - sippedAt;
      const elapsedTicks = Math.floor(elapsedMs / OSRS_TICK_MS);
      return Math.max(0, MAX_TICKS - 1 - elapsedTicks);
    };

    setDisplayTicks(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setDisplayTicks(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, OSRS_TICK_MS);

    return () => clearInterval(interval);
  }, [sippedAt]);

  return displayTicks;
};
