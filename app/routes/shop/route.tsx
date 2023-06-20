import { Outlet } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';

import { Footer } from '~/components/Footer';
import { Navigation } from '~/routes/shop/Navigation';
import { getConsent } from '~/session.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Shop' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const consent = await getConsent(request);

  if (!consent) {
    return redirect('/');
  }

  return null;
};

export default function Shop() {
  return (
    <div>
      <Navigation/>
      <Outlet/>
      <Footer title="Shop"/>
    </div>
  );
}
