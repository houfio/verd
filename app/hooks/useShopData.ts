import { useMatchesData } from '~/hooks/useMatchesData';
import type { loader } from '~/routes/shop/route';

export function useShopData() {
  const data = useMatchesData<typeof loader>('routes/shop');

  if (!data) {
    throw new Error('not in shop');
  }

  return data;
}
