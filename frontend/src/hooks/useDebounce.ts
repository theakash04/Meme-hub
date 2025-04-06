import { useRef, useCallback } from "react";

function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timer = useRef<number | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}

export default useDebounce;
