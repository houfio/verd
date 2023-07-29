import { Outlet } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import { Footer } from '~/components/Footer';
import { db } from '~/db.server';
import { Navigation } from '~/routes/shop/Navigation';
import { getCondition, getProducts } from '~/session.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Shop' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const condition = await getCondition(request);

  if (condition === undefined) {
    return redirect('/');
  }

  const products = await getProducts(request);
  const scenarios = await db.scenario.findMany();

  if (products.length === scenarios.length) {
    return redirect('/survey?k=post');
  }

  return json({
    scenario: scenarios[products.length],
    total: scenarios.length,
    current: products.length + 1,
    condition
  });
};

export default function Shop() {
  return (
    <>
      <Navigation/>
      <Outlet/>
      <Footer title="Shop"/>
    </>
  );
}
