"use client";

import { useEffect, useState } from "react";

function currentLagosTime() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Location + live clock, ticking once a minute — minute precision only. */
export function Clock() {
  const [time, setTime] = useState(currentLagosTime);

  useEffect(() => {
    const id = setInterval(() => setTime(currentLagosTime()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    // Server and client render at slightly different instants, so the exact
    // minute can legitimately differ between them.
    <span
      suppressHydrationWarning
      className="whitespace-nowrap text-[11px] uppercase tracking-[0.12em]"
      style={{ color: "var(--faint)" }}
    >
      Lagos · {time}
    </span>
  );
}
