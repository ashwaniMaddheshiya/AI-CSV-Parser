"use client";

import { useEffect, useRef, useState } from "react";

interface UseImportProgressOptions {
  isActive: boolean;
  rowCount: number;
}

interface UseImportProgressReturn {
  progress: number;
}

const BATCH_SIZE = 50;

export function useImportProgress({
  isActive,
  rowCount,
}: UseImportProgressOptions): UseImportProgressReturn {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const batchCount = Math.max(1, Math.ceil(rowCount / BATCH_SIZE));
    const estimatedMs = batchCount * 4000;
    const tickMs = 200;
    const maxProgress = 92;
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs;
      const ratio = Math.min(elapsed / estimatedMs, 1);
      const next = Math.min(maxProgress, Math.round(ratio * maxProgress));
      setProgress(next);
    }, tickMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, rowCount]);

  return { progress };
}
