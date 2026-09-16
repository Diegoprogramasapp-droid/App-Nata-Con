// lib/useStopwatch.ts
import { useEffect, useRef, useState } from "react";
import { centisecondsToTimeString } from "./times";

// Cronômetro real: conta em centésimos, sobrevive a re-renders,
// e usa Date.now() (não setInterval puro) pra não perder precisão em segundo plano.
export function useStopwatch() {
  const [centiseconds, setCentiseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isRunning) return;

    function tick() {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      setCentiseconds(Math.floor((accumulatedRef.current + elapsed) / 10));
      rafRef.current = requestAnimationFrame(tick);
    }

    startTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  function start() {
    setIsRunning(true);
  }

  function pause() {
    if (startTimeRef.current) {
      accumulatedRef.current += Date.now() - startTimeRef.current;
    }
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    setCentiseconds(0);
    accumulatedRef.current = 0;
    startTimeRef.current = null;
  }

  return {
    centiseconds,
    formatted: centisecondsToTimeString(centiseconds),
    isRunning,
    start,
    pause,
    reset,
  };
}
