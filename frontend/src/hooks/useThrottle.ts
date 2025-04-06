import { useRef } from "react";

function useThrottle<T extends (...args: any[]) => void>(
  func: T,
  limit: number = 30
): T {
  const lastCall = useRef(0);

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= limit) {
      lastCall.current = now;
      func(...args);
    }
  }) as T;
}

export default useThrottle;
