import { useEffect, useState } from 'react';
import { getSignedImageUrl } from '@/api/reportMutations';

export function useSignedImageUrl(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getSignedImageUrl(path)
      .then((signed) => {
        if (!cancelled) setUrl(signed);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { url, loading };
}
