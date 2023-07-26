import { Outlet } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import { Footer } from '~/components/Footer';
import { db } from '~/db.server';
import { useBasketState } from '~/hooks/useBasketState';
import { Navigation } from '~/routes/shop/Navigation';
import { getCondition, getConsent, getProducts } from '~/session.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Shop' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const condition = await getCondition(request);

  if (!condition) {
    return redirect('/');
  }

  const productIds = await getProducts(request);
  const products = await db.product.findMany(({
    where: {
      id: { in: productIds }
    },
    select: {
      id: true,
      scenarioId: true,
      name: true,
      brand: true,
      images: true,
      price: true
    }
  }));
  const scenarios = await db.scenario.findMany();

  return json({
    products,
    scenarios,
    condition
  });
};

export default function Shop() {
  return (
    <useBasketState.Provider>
      <Navigation/>
      <Outlet/>
      <Footer title="Shop"/>
    </useBasketState.Provider>
  );
}
