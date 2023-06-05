import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matches = useMatches();
  const route = useMemo(
    () => matches.find((route) => route.id === id),
    [matches, id]
  );

  return route?.data;
}
