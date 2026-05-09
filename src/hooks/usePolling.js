import { useCallback, useEffect, useRef, useState } from 'react';

export function usePolling(fetcher, { interval = 5000, immediate = true } = {}) {
  const mountedRef = useRef(false);
  const hasDataRef = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      if (!hasDataRef.current) {
        setLoading(true);
      }

      const result = await fetcher();

      if (mountedRef.current) {
        hasDataRef.current = true;
        setData(result);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    mountedRef.current = true;

    if (immediate) {
      load();
    }

    const timer = window.setInterval(load, interval);

    return () => {
      mountedRef.current = false;
      window.clearInterval(timer);
    };
  }, [immediate, interval, load]);

  return { data, error, loading, lastUpdated, refetch: load };
}
