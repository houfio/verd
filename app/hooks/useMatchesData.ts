import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

export function useMatchesData<T extends Record<string, unknown>>(id: string) {
  const matches = useMatches();
  const route = useMemo(
    () => matches.find((route) => route.id === id),
    [matches, id]
  );

  return route?.data as T | undefined;
}
